from groq import Groq
from .config import get_settings


def _init_groq_client():
    """Initialize Groq client from settings."""
    settings = get_settings()
    if not settings.GROQ_API_KEY:
        return None
    return Groq(api_key=settings.GROQ_API_KEY)


groq_client = _init_groq_client()


def get_llm_client() -> Groq:
    """Get the Groq LLM client instance."""
    if groq_client is None:
        settings = get_settings()
        from pathlib import Path
        env_file_path = Path(__file__).parent.parent / ".env"
        is_set = "set" if settings.GROQ_API_KEY else "not set"
        raise RuntimeError(
            f"GROQ_API_KEY not configured. "
            f"Please set GROQ_API_KEY in your .env file at: {env_file_path}. "
            f"Current status: {is_set}"
        )
    return groq_client