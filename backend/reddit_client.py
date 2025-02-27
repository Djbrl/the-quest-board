# reddit_client.py
import praw
import json
from datetime import datetime

class RedditClient:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id='aJ6hc4347-5h0a_9Q63HBA',
            client_secret='7suJII6ZHCCPreinE1OB0b1gR_CpwA',
            user_agent='tqb (by /u/DistinguishableLotus)'
        )

    def fetch_posts(self, subreddit_name):
        subreddit = self.reddit.subreddit(subreddit_name)
        posts = subreddit.new(limit=50)
        return posts

def post_to_dict(post):
    return {
        'title': post.title,
        'author': str(post.author),  # Convert Redditor object to string
        'score': post.score,
        'upvotes': post.ups,
        'description' : post.selftext,
        'permalink': post.url,
        'created_utc': post.created_utc,  # Convert timestamp to ISO format
        'over_18': post.over_18,
        'num_comments': post.num_comments,
        'subreddit': post.subreddit_name_prefixed
    }

if __name__ == "__main__":
    client = RedditClient()
    subreddits = ['HungryArtists', 'artcommissions', 'hireanartist', 'commissions', 'DesignJobs', 'starvingartists', 'fantasyartists', 'gameDevClassifieds', 'gameDevJobs']
    
    all_posts = []

    for subreddit in subreddits:
        posts = client.fetch_posts(subreddit)
        
        # Convert posts to a list of dictionaries
        posts_list = [post_to_dict(post) for post in posts]
        all_posts.extend(posts_list)
    
    # Convert the aggregated list of dictionaries to a JSON string
    posts_json = json.dumps(all_posts, ensure_ascii=False, indent=4)
    print(posts_json)
