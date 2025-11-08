from fastapi import APIRouter
from datetime import datetime, timedelta
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


# Response models
class Metric(BaseModel):
    title: str
    value: str
    change: str
    trend: str
    icon: str
    color: str


class SentimentData(BaseModel):
    day: str
    positive: int
    neutral: int
    negative: int


class Topic(BaseModel):
    text: str
    count: int
    sentiment: str


class SourceData(BaseModel):
    name: str
    value: int
    color: str


class Mention(BaseModel):
    id: int
    author: str
    platform: str
    content: str
    sentiment: str
    timestamp: str
    topic: str


class Insight(BaseModel):
    icon: str
    title: str
    priority: str
    description: str
    advice: str


@router.get("/metrics", response_model=List[Metric])
async def get_metrics():
    """Get dashboard metrics overview"""
    return [
        {
            "title": "citizenSatisfaction",
            "value": "72%",
            "change": "+4.3%",
            "trend": "up",
            "icon": "ThumbsUp",
            "color": "text-chart-1",
        },
        {
            "title": "emergingIssues",
            "value": "3",
            "change": "+1 new",
            "trend": "up",
            "icon": "AlertTriangle",
            "color": "text-chart-2",
        },
        {
            "title": "publicResponseImpact",
            "value": "+18%",
            "change": "+5.2%",
            "trend": "up",
            "icon": "Activity",
            "color": "text-chart-3",
        },
        {
            "title": "civicEngagement",
            "value": "4,132",
            "change": "+9.8%",
            "trend": "up",
            "icon": "Users",
            "color": "text-chart-4",
        },
    ]


@router.get("/sentiment", response_model=List[SentimentData])
async def get_sentiment():
    """Get sentiment analysis data by day"""
    return [
        {"day": "monday", "positive": 45, "neutral": 30, "negative": 25},
        {"day": "tuesday", "positive": 52, "neutral": 28, "negative": 20},
        {"day": "wednesday", "positive": 48, "neutral": 32, "negative": 20},
        {"day": "thursday", "positive": 61, "neutral": 25, "negative": 14},
        {"day": "friday", "positive": 55, "neutral": 30, "negative": 15},
        {"day": "saturday", "positive": 40, "neutral": 35, "negative": 25},
        {"day": "sunday", "positive": 38, "neutral": 37, "negative": 25},
    ]


@router.get("/topics", response_model=List[Topic])
async def get_topics():
    """Get topics word cloud data"""
    return [
        {"text": "verkeer", "count": 245, "sentiment": "negative"},
        {"text": "groenvoorziening", "count": 189, "sentiment": "positive"},
        {"text": "veiligheid", "count": 167, "sentiment": "neutral"},
        {"text": "parkeren", "count": 156, "sentiment": "negative"},
        {"text": "onderwijs", "count": 142, "sentiment": "positive"},
        {"text": "afval", "count": 128, "sentiment": "neutral"},
        {"text": "evenementen", "count": 115, "sentiment": "positive"},
        {"text": "fietspaden", "count": 98, "sentiment": "positive"},
        {"text": "winkels", "count": 87, "sentiment": "neutral"},
        {"text": "jeugd", "count": 76, "sentiment": "positive"},
        {"text": "bereikbaarheid", "count": 72, "sentiment": "negative"},
        {"text": "speeltuinen", "count": 65, "sentiment": "positive"},
    ]


@router.get("/sources", response_model=List[SourceData])
async def get_sources():
    """Get source breakdown data"""
    return [
        {"name": "X (Twitter)", "value": 3245, "color": "hsl(var(--chart-1))"},
        {"name": "Facebook", "value": 2891, "color": "hsl(var(--chart-2))"},
        {"name": "Instagram", "value": 2456, "color": "hsl(var(--chart-4))"},
        {"name": "LinkedIn", "value": 1678, "color": "hsl(var(--chart-3))"},
        {"name": "Nieuwssites", "value": 1432, "color": "hsl(var(--chart-5))"},
        {"name": "Overig", "value": 1145, "color": "hsl(var(--muted))"},
    ]


@router.get("/mentions", response_model=List[Mention])
async def get_mentions():
    """Get recent mentions"""
    now = datetime.now()
    return [
        {
            "id": 1,
            "author": "Jan de Vries",
            "platform": "X",
            "content": "Geweldig om te zien dat de gemeente eindelijk werk maakt van groenvoorzieningen! 🌳",
            "sentiment": "positive",
            "timestamp": (now - timedelta(minutes=15)).isoformat(),
            "topic": "groenvoorziening",
        },
        {
            "id": 2,
            "author": "Maria Janssen",
            "platform": "Facebook",
            "content": "Weer files in het centrum. Wanneer komt er een oplossing voor de verkeersproblemen?",
            "sentiment": "negative",
            "timestamp": (now - timedelta(minutes=32)).isoformat(),
            "topic": "verkeer",
        },
        {
            "id": 3,
            "author": "Peter Bakker",
            "platform": "LinkedIn",
            "content": "Mooie ontwikkelingen in de lokale economie. Trots op onze gemeente!",
            "sentiment": "positive",
            "timestamp": (now - timedelta(minutes=47)).isoformat(),
            "topic": "economie",
        },
        {
            "id": 4,
            "author": "Sophie Verhoeven",
            "platform": "Instagram",
            "content": "Leuk evenement afgelopen weekend! Meer van dit soort initiatieven graag 🎉",
            "sentiment": "positive",
            "timestamp": (now - timedelta(minutes=68)).isoformat(),
            "topic": "evenementen",
        },
        {
            "id": 5,
            "author": "Thomas van Dijk",
            "platform": "X",
            "content": "Parkeren is echt een ramp hier. Kan hier iets aan gedaan worden?",
            "sentiment": "negative",
            "timestamp": (now - timedelta(minutes=95)).isoformat(),
            "topic": "parkeren",
        },
    ]


@router.get("/insights", response_model=List[Insight])
async def get_insights():
    """Get AI insights"""
    return [
        {
            "icon": "AlertCircle",
            "title": "trafficIssue",
            "priority": "high",
            "description": "trafficDescription",
            "advice": "trafficAdvice",
        },
        {
            "icon": "TrendingUp",
            "title": "positiveDevelopment",
            "priority": "medium",
            "description": "positiveDescription",
            "advice": "positiveAdvice",
        },
        {
            "icon": "Users",
            "title": "youthEngagement",
            "priority": "medium",
            "description": "youthDescription",
            "advice": "youthAdvice",
        },
    ]

