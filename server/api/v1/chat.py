from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from core import get_llm_client
from core.config import get_settings
from .retrieval import retrieve_relevant_chunks, format_context_for_llm


router = APIRouter(prefix="/chat", tags=["chat"])

# In-memory chat history storage
chat_history: list[dict] = []

# System prompt for RAG-enabled chat
RAG_SYSTEM_PROMPT = """You are a helpful assistant that answers questions about civic engagement, community posts, and public discussions. 
You have access to a knowledge base of posts and comments from various sources.

When answering questions:
1. Use the provided context from the knowledge base to give accurate, relevant answers
2. Cite sources when referencing specific information (mention URLs or sources when available)
3. If the context doesn't contain relevant information, say so clearly
4. Be concise but thorough in your responses
5. If asked about something not in the context, acknowledge this and provide general guidance if possible"""


class ChatRequest(BaseModel):
    message: str
    use_rag: bool = True  # Enable RAG by default
    n_results: int = 5  # Number of chunks to retrieve


class ChatResponse(BaseModel):
    response: str
    sources: list[dict] = []  # List of sources used


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the LLM with RAG capabilities."""
    try:
        groq_client = get_llm_client()
        settings = get_settings()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM client not configured: {str(e)}"
        )
    
    # Retrieve relevant context from ChromaDB if RAG is enabled
    context = ""
    sources = []
    
    if request.use_rag:
        try:
            chunks = retrieve_relevant_chunks(
                query=request.message,
                collection_name="civicpulse",
                n_results=request.n_results
            )
            
            if chunks:
                context = format_context_for_llm(chunks)
                # Extract unique sources for response
                seen_sources = set()
                for chunk in chunks:
                    metadata = chunk.get("metadata", {})
                    source_info = {
                        "url": metadata.get("url"),
                        "source": metadata.get("source"),
                        "type": metadata.get("type", "unknown")
                    }
                    source_key = (source_info.get("url"), source_info.get("source"))
                    if source_key not in seen_sources and (source_info.get("url") or source_info.get("source")):
                        sources.append(source_info)
                        seen_sources.add(source_key)
        except Exception as e:
            # If retrieval fails, continue without context
            pass
    
    # Build messages for the LLM
    messages = []
    
    # Add system prompt with context if available
    if context:
        system_message = f"{RAG_SYSTEM_PROMPT}\n\nRelevant Context:\n{context}\n\nPlease answer the user's question based on the context provided above."
    else:
        system_message = RAG_SYSTEM_PROMPT
    
    messages.append({
        "role": "system",
        "content": system_message
    })
    
    # Add conversation history (excluding system messages)
    for msg in chat_history:
        if msg.get("role") != "system":
            messages.append(msg)
    
    # Add current user message
    messages.append({
        "role": "user",
        "content": request.message
    })
    
    # Add user message to history
    chat_history.append({
        "role": "user",
        "content": request.message
    })
    
    try:
        # Call Groq API with conversation history and context
        response = groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.0,
            max_tokens=1024
        )
        
        assistant_message = response.choices[0].message.content
        
        # Add assistant response to history
        chat_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return ChatResponse(
            response=assistant_message,
            sources=sources
        )
    
    except Exception as e:
        # Remove the user message from history if API call failed
        if chat_history and chat_history[-1].get("role") == "user":
            chat_history.pop()
        raise HTTPException(
            status_code=500,
            detail=f"Error calling LLM: {str(e)}"
        )


@router.delete("/")
async def clear_chat():
    """Clear chat history."""
    chat_history.clear()
    return {"message": "Chat history cleared"}
