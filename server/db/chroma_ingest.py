"""
Functions for retrieving data from PostgreSQL and storing it in ChromaDB.

This module provides functionality to:
- Retrieve Posts and Comments from PostgreSQL
- Chunk the content for vector storage
- Store chunks in ChromaDB with appropriate metadata
"""
import uuid
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from db.models import Post, Comment
from db import get_session
from core import get_chroma_client


def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """
    Split text into chunks of specified size with overlap.
    
    Args:
        text: The text to chunk
        chunk_size: Maximum size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
    
    Returns:
        List of text chunks
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    # Ensure chunk_overlap is less than chunk_size
    if chunk_overlap >= chunk_size:
        chunk_overlap = chunk_size // 2
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        
        # Move start position forward, accounting for overlap
        start = end - chunk_overlap
        
        # Prevent infinite loop
        if start <= 0 or start >= text_length:
            break
    
    return chunks


def retrieve_posts_with_comments(
    session: Session,
    limit: Optional[int] = None,
    offset: int = 0
) -> List[Post]:
    """
    Retrieve posts from PostgreSQL with their associated comments.
    
    Args:
        session: SQLModel database session
        limit: Maximum number of posts to retrieve (None for all)
        offset: Number of posts to skip
    
    Returns:
        List of Post objects with loaded comments
    """
    statement = select(Post).options(selectinload(Post.comments)).offset(offset)
    if limit:
        statement = statement.limit(limit)
    
    posts = session.exec(statement).all()
    return list(posts)


def retrieve_all_posts(session: Session) -> List[Post]:
    """
    Retrieve all posts from PostgreSQL with their comments.
    
    Args:
        session: SQLModel database session
    
    Returns:
        List of all Post objects with loaded comments
    """
    return retrieve_posts_with_comments(session, limit=None)


def create_post_chunks(post: Post, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
    """
    Create chunks from a Post object with metadata.
    
    Args:
        post: Post object to chunk
        chunk_size: Maximum size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
    
    Returns:
        List of dictionaries containing chunk text and metadata
    """
    chunks = []
    post_chunks = chunk_text(post.content, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    for idx, chunk_text in enumerate(post_chunks):
        chunk_data = {
            "text": chunk_text,
            "metadata": {
                "type": "post",
                "post_id": str(post.id),
                "chunk_index": idx,
                "source": post.source,
                "url": post.url,
                "score": post.score,
                "created_at": post.created_at.isoformat() if post.created_at else None,
                "total_chunks": len(post_chunks),
            }
        }
        chunks.append(chunk_data)
    
    return chunks


def create_comment_chunks(comment: Comment, post: Post, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
    """
    Create chunks from a Comment object with metadata.
    
    Args:
        comment: Comment object to chunk
        post: Parent Post object for additional context
        chunk_size: Maximum size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
    
    Returns:
        List of dictionaries containing chunk text and metadata
    """
    chunks = []
    comment_chunks = chunk_text(comment.content, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    for idx, chunk_text in enumerate(comment_chunks):
        chunk_data = {
            "text": chunk_text,
            "metadata": {
                "type": "comment",
                "comment_id": str(comment.id),
                "post_id": str(post.id),
                "chunk_index": idx,
                "source": post.source,
                "url": post.url,
                "score": post.score,
                "created_at": comment.created_at.isoformat() if comment.created_at else None,
                "total_chunks": len(comment_chunks),
            }
        }
        chunks.append(chunk_data)
    
    return chunks


def store_chunks_in_chromadb(
    collection_name: str,
    chunks: List[Dict[str, Any]],
    reset_collection: bool = False
) -> None:
    """
    Store text chunks in ChromaDB collection.
    
    Args:
        collection_name: Name of the ChromaDB collection
        chunks: List of dictionaries with 'text' and 'metadata' keys
        reset_collection: If True, delete existing collection before adding chunks
    """
    client = get_chroma_client()
    
    # Get or create collection
    if reset_collection:
        try:
            client.delete_collection(collection_name)
        except Exception:
            pass  # Collection might not exist
    
    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={"description": "CivicPulse posts and comments"}
    )
    
    if not chunks:
        return
    
    # Prepare data for ChromaDB
    documents = [chunk["text"] for chunk in chunks]
    metadatas = [chunk["metadata"] for chunk in chunks]
    # Generate unique IDs: type_postid_commentid_chunkindex
    ids = []
    for chunk in chunks:
        meta = chunk["metadata"]
        chunk_type = meta["type"]
        post_id = meta.get("post_id", "unknown")
        comment_id = meta.get("comment_id", "")
        chunk_idx = meta["chunk_index"]
        
        if chunk_type == "post":
            chunk_id = f"post_{post_id}_{chunk_idx}"
        else:
            chunk_id = f"comment_{post_id}_{comment_id}_{chunk_idx}"
        
        ids.append(chunk_id)
    
    # Add chunks to collection
    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )


def ingest_posts_to_chromadb(
    collection_name: str = "civicpulse",
    limit: Optional[int] = None,
    offset: int = 0,
    reset_collection: bool = False,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> Dict[str, Any]:
    """
    Main function to retrieve posts from PostgreSQL, chunk them, and store in ChromaDB.
    
    Args:
        collection_name: Name of the ChromaDB collection
        limit: Maximum number of posts to process (None for all)
        offset: Number of posts to skip
        reset_collection: If True, delete existing collection before adding chunks
        chunk_size: Maximum size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
    
    Returns:
        Dictionary with statistics about the ingestion process
    """
    # Update chunk_text function parameters via closure or make it configurable
    # For now, we'll use the default chunk_text function
    
    all_chunks = []
    posts_processed = 0
    comments_processed = 0
    
    # Get database session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Retrieve posts with comments
        posts = retrieve_posts_with_comments(session, limit=limit, offset=offset)
        
        for post in posts:
            # Create chunks from post content
            post_chunks = create_post_chunks(post, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
            all_chunks.extend(post_chunks)
            posts_processed += 1
            
            # Create chunks from comment content
            for comment in post.comments:
                comment_chunks = create_comment_chunks(comment, post, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
                all_chunks.extend(comment_chunks)
                comments_processed += 1
        
        # Store all chunks in ChromaDB
        if all_chunks:
            store_chunks_in_chromadb(
                collection_name=collection_name,
                chunks=all_chunks,
                reset_collection=reset_collection
            )
        
        return {
            "status": "success",
            "posts_processed": posts_processed,
            "comments_processed": comments_processed,
            "total_chunks": len(all_chunks),
            "collection_name": collection_name
        }
    
    finally:
        session.close()


def ingest_single_post_to_chromadb(
    post_id: uuid.UUID,
    collection_name: str = "civicpulse",
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> Dict[str, Any]:
    """
    Ingest a single post and its comments into ChromaDB.
    
    Args:
        post_id: UUID of the post to ingest
        collection_name: Name of the ChromaDB collection
        chunk_size: Maximum size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
    
    Returns:
        Dictionary with statistics about the ingestion
    """
    all_chunks = []
    
    # Get database session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Retrieve specific post with comments
        statement = select(Post).where(Post.id == post_id).options(selectinload(Post.comments))
        post = session.exec(statement).first()
        
        if not post:
            return {
                "status": "error",
                "message": f"Post with id {post_id} not found"
            }
        
        # Create chunks from post content
        post_chunks = create_post_chunks(post, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        all_chunks.extend(post_chunks)
        
        # Create chunks from comment content
        for comment in post.comments:
            comment_chunks = create_comment_chunks(comment, post, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
            all_chunks.extend(comment_chunks)
        
        # Store chunks in ChromaDB
        if all_chunks:
            store_chunks_in_chromadb(
                collection_name=collection_name,
                chunks=all_chunks,
                reset_collection=False
            )
        
        return {
            "status": "success",
            "post_id": str(post_id),
            "comments_processed": len(post.comments),
            "total_chunks": len(all_chunks),
            "collection_name": collection_name
        }
    
    finally:
        session.close()

