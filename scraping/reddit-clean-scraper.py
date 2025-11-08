import requests
import time
import os
import pandas as pd
import random
from tqdm import tqdm

# -----------------------------------------
# CONFIG
# -----------------------------------------
RELEVANT_SUBREDDITS = [
    "Netherlands", "thenetherlands", "dutch", "Nederland",
    "Netherlands_Memes", "NetherlandsHousing", "StudyInTheNetherlands",
    "TheHague", "Amsterdam", "Rentbusters", "europe"
]

KEYWORD = "rijswijk"
HEADERS = {"User-Agent": "civicpulse-scraper-v1.0 (by u/your_username)"}

OUTPUT_PATH = "datasets/cleaned_reddit_data.csv"
MAX_PAGES_PER_SUB = 50
RATE_LIMIT = 100  # requests per minute
DELAY = 60 / RATE_LIMIT
MAX_BACKOFF = 120  # max sleep in seconds
MAX_RETRIES = 5

os.makedirs("datasets", exist_ok=True)

# -----------------------------------------
# SAFE REQUEST WITH BACKOFF
# -----------------------------------------
def safe_request(url, params=None):
    """GET with exponential backoff, retry, and jitter."""
    backoff = 5
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = requests.get(url, headers=HEADERS, params=params, timeout=15)
            if r.status_code == 429:
                tqdm.write(f"⏳ Rate limited — sleeping {backoff}s...")
                time.sleep(backoff + random.uniform(0, 3))
                backoff = min(backoff * 2, MAX_BACKOFF)
                continue
            r.raise_for_status()
            time.sleep(DELAY + random.uniform(0, 0.3))
            return r
        except requests.exceptions.RequestException as e:
            tqdm.write(f"⚠️ Attempt {attempt}/{MAX_RETRIES}: {e}")
            time.sleep(backoff + random.uniform(0, 2))
            backoff = min(backoff * 2, MAX_BACKOFF)
    tqdm.write(f"❌ Failed after {MAX_RETRIES} retries → {url}")
    return None


# -----------------------------------------
# FETCH HELPERS
# -----------------------------------------
def fetch_posts(subreddit, after=None):
    url = f"https://www.reddit.com/r/{subreddit}/search.json"
    params = {
        "q": KEYWORD,
        "restrict_sr": "on",
        "sort": "new",
        "after": after,
        "limit": 100,
    }
    resp = safe_request(url, params)
    return resp.json() if resp else None


def fetch_comments(subreddit, post_id):
    url = f"https://www.reddit.com/r/{subreddit}/comments/{post_id}.json"
    resp = safe_request(url, {"limit": 500})
    return resp.json() if resp else None


def append_to_master(df: pd.DataFrame, path: str):
    if not os.path.exists(path):
        df.to_csv(path, index=False, encoding="utf-8")
    else:
        df.to_csv(path, mode="a", header=False, index=False, encoding="utf-8")


# -----------------------------------------
# MAIN SCRAPER LOOP
# -----------------------------------------
try:
    for SUBREDDIT in RELEVANT_SUBREDDITS:
        tqdm.write(f"\n🔍 Searching for '{KEYWORD}' in r/{SUBREDDIT} …")
        after = None
        all_posts = []

        for _ in tqdm(range(MAX_PAGES_PER_SUB), desc=f"{SUBREDDIT:<18}", ncols=100):
            data = fetch_posts(SUBREDDIT, after)
            if not data or "data" not in data or not data["data"]["children"]:
                break
            posts = data["data"]["children"]
            all_posts.extend(posts)
            after = data["data"].get("after")
            if not after:
                break

        tqdm.write(f"✅ {len(all_posts)} posts found in r/{SUBREDDIT}")

        # Clean + append posts
        post_rows = []
        for p in all_posts:
            d = p["data"]
            post_rows.append({
                "post_id": d["id"],
                "created_at": d["created_utc"],
                "content": (d.get("title") or "") + " " + (d.get("selftext") or ""),
                "content_type": "post",
                "source": "reddit",
                "url": d.get("url"),
                "score": d.get("score", 0),
                "subreddit": SUBREDDIT
            })

        posts_df = pd.DataFrame(post_rows)
        posts_df = posts_df[posts_df["content"].str.strip().astype(bool)]
        posts_df = posts_df.drop_duplicates(subset=["post_id", "content"])
        append_to_master(posts_df, OUTPUT_PATH)

        tqdm.write(f"💾 Added {len(posts_df)} posts to {OUTPUT_PATH}")

        # Fetch comments
        comment_rows = []
        for p in tqdm(all_posts, desc=f"Comments {SUBREDDIT:<12}", ncols=100):
            post_id = p["data"]["id"]
            comments_json = fetch_comments(SUBREDDIT, post_id)
            if not comments_json or len(comments_json) < 2:
                continue
            for c in comments_json[1]["data"]["children"]:
                if c["kind"] != "t1":
                    continue
                cd = c["data"]
                comment_rows.append({
                    "post_id": post_id,
                    "created_at": cd["created_utc"],
                    "content": (cd.get("body") or "").replace("\n", " ").strip(),
                    "content_type": "comment",
                    "source": "reddit",
                    "url": f"https://www.reddit.com{cd.get('permalink','')}",
                    "score": cd.get("score", 0),
                    "subreddit": SUBREDDIT
                })

        if comment_rows:
            comments_df = pd.DataFrame(comment_rows)
            comments_df = comments_df[comments_df["content"].str.strip().astype(bool)]
            comments_df = comments_df.drop_duplicates(subset=["post_id", "content"])
            append_to_master(comments_df, OUTPUT_PATH)
            tqdm.write(f"💾 Added {len(comments_df)} comments to {OUTPUT_PATH}")

    print("\n🎉 All subreddits processed successfully!")

except KeyboardInterrupt:
    print("\n🛑 Interrupted — progress saved.")
