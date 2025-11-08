"""
Retrieval functions for querying ChromaDB to get relevant context for RAG.
"""
from typing import List, Dict, Any, Optional
from core import get_chroma_client


def retrieve_relevant_chunks(
    query: str,
    collection_name: str = "civicpulse",
    n_results: int = 5
) -> List[Dict[str, Any]]:
    """
    Retrieve relevant chunks from ChromaDB based on a query.
    
    Args:
        query: The search query
        collection_name: Name of the ChromaDB collection
        n_results: Number of results to return
    
    Returns:
        List of dictionaries containing document text and metadata
    """
    try:
        client = get_chroma_client()
        
        # Check if collection exists, if not return empty list
        try:
            collection = client.get_collection(name=collection_name)
        except Exception:
            # Collection doesn't exist
            return []
        
        # Query ChromaDB
        results = collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Format results
        chunks = []
        if results["documents"] and len(results["documents"]) > 0:
            documents = results["documents"][0]
            metadatas = results["metadatas"][0] if results["metadatas"] else [{}] * len(documents)
            ids = results["ids"][0] if results["ids"] else []
            distances = results["distances"][0] if results["distances"] else []
            
            for i, doc in enumerate(documents):
                chunk = {
                    "text": doc,
                    "metadata": metadatas[i] if i < len(metadatas) else {},
                    "id": ids[i] if i < len(ids) else None,
                    "distance": distances[i] if i < len(distances) else None
                }
                chunks.append(chunk)
        
        return chunks
    
    except Exception as e:
        # If collection doesn't exist or query fails, return empty list
        return []


def format_context_for_llm(chunks: List[Dict[str, Any]]) -> str:
    """
    Format retrieved chunks into a context string for the LLM.
    
    Args:
        chunks: List of chunk dictionaries from ChromaDB
    
    Returns:
        Formatted context string
    """
    if not chunks:
        return ""
    
    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        text = chunk.get("text", "")
        metadata = chunk.get("metadata", {})
        
        # Build context entry
        entry = f"[Context {i}]\n"
        
        # Add source information if available
        if metadata.get("source"):
            entry += f"Source: {metadata['source']}\n"
        if metadata.get("url"):
            entry += f"URL: {metadata['url']}\n"
        if metadata.get("type"):
            entry += f"Type: {metadata['type']}\n"
        
        entry += f"Content: {text}\n"
        
        context_parts.append(entry)
    
    return "\n".join(context_parts)

