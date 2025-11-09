from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from core import get_llm_client
from core.config import get_settings
from .retrieval import retrieve_relevant_chunks, format_context_for_llm
from api.dashboard import get_metrics, get_sentiment, get_topics


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


async def format_dashboard_data_for_prompt() -> str:
    """Fetch and format dashboard data for inclusion in system prompt."""
    try:
        metrics = await get_metrics()
        sentiment = await get_sentiment()
        topics = await get_topics()
        
        dashboard_info = "\n=== DASHBOARD INSIGHTS ===\n\n"
        
        # Format metrics (handle both dict and Pydantic model)
        dashboard_info += "KEY METRICS:\n"
        for metric in metrics:
            title = metric.get('title') if isinstance(metric, dict) else metric.title
            value = metric.get('value') if isinstance(metric, dict) else metric.value
            change = metric.get('change') if isinstance(metric, dict) else metric.change
            trend = metric.get('trend') if isinstance(metric, dict) else metric.trend
            dashboard_info += f"- {title}: {value} ({change}, trend: {trend})\n"
        
        # Format sentiment summary
        dashboard_info += "\nSENTIMENT OVERVIEW (by day):\n"
        for day_data in sentiment:
            day = day_data.get('day') if isinstance(day_data, dict) else day_data.day
            positive = day_data.get('positive') if isinstance(day_data, dict) else day_data.positive
            neutral = day_data.get('neutral') if isinstance(day_data, dict) else day_data.neutral
            negative = day_data.get('negative') if isinstance(day_data, dict) else day_data.negative
            total = positive + neutral + negative
            if total > 0:
                pos_pct = (positive / total) * 100
                neg_pct = (negative / total) * 100
                dashboard_info += f"- {day.capitalize()}: {pos_pct:.1f}% positive, {neg_pct:.1f}% negative\n"
        
        # Format top topics
        dashboard_info += "\nTOP DISCUSSED TOPICS:\n"
        for topic in topics[:10]:  # Top 10 topics
            text = topic.get('text') if isinstance(topic, dict) else topic.text
            count = topic.get('count') if isinstance(topic, dict) else topic.count
            sentiment_val = topic.get('sentiment') if isinstance(topic, dict) else topic.sentiment
            dashboard_info += f"- {text}: {count} mentions (sentiment: {sentiment_val})\n"
        
        dashboard_info += "\nUse this dashboard data to provide context-aware answers about current civic engagement trends, sentiment patterns, and popular discussion topics.\n"
        
        return dashboard_info
    except Exception as e:
        # If dashboard data fetch fails, return empty string
        return ""


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
    
    # Fetch dashboard data for system prompt
    dashboard_data = await format_dashboard_data_for_prompt()
    
    # Build messages for the LLM
    messages = []
    
    # Build system prompt with dashboard data and context
    system_message = RAG_SYSTEM_PROMPT
    
    # Add dashboard data if available
    if dashboard_data:
        system_message += dashboard_data
    
    # Add RAG context if available
    if context:
        system_message += f"\n\nRelevant Context from Knowledge Base:\n{context}\n\nPlease answer the user's question based on the dashboard insights and context provided above."
    
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
