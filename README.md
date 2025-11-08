# CivicPulse
AI-powered dashboard that analyzes public online conversations to reveal trends, sentiment, and actionable insights for smarter governance.

## Usage

**Frontend**

1. Install packages
```
npm install
```

2. Run
```
npm run dev
```

**Backend**

1. Run server
```
uv run fastapi dev main.py
```

## Quick Notes
Database Container Start:
```
docker run --name postgres_container -e POSTGRES_PASSWORD=<DB_PASS> -d -p <PORT>:<PORT> -v postgres_data:/var/lib/postgresql/data postgres
```