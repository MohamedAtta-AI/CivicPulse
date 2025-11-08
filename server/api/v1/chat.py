from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from core import get_llm_client
from core.config import get_settings


router = APIRouter(prefix="/chat", tags=["chat"])

# In-memory chat history storage
chat_history: list[dict] = []


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the LLM and get a response."""
    try:
        groq_client = get_llm_client()
        settings = get_settings()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM client not configured: {str(e)}"
        )
    
    # Add user message to history
    chat_history.append({
        "role": "user",
        "content": request.message
    })
    
    try:
        # Call Groq API with conversation history
        response = groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=chat_history,
            temperature=0.0,
            max_tokens=1024
        )
        
        assistant_message = response.choices[0].message.content
        
        # Add assistant response to history
        chat_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return ChatResponse(response=assistant_message)
    
    except Exception as e:
        # Remove the user message from history if API call failed
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
