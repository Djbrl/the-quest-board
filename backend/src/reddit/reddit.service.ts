import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { exec } from 'child_process'; // Import exec directly from 'child_process'

@Injectable()
export class RedditService {
  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  async getPostsFromSubreddit(url) {
    try {

      if (!this.accessToken || (this.expiresAt && Date.now() > this.expiresAt)) {
        const tokenResponse = await this.requestAccessToken();
        this.accessToken = tokenResponse.access_token;
        this.expiresAt = Date.now() + tokenResponse.expires_in * 1000;
      }
  
      
      const postsResponse = await axios.get(`https://oauth.reddit.com/${url}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'User-Agent': process.env.REDDIT_USERAGENT,
        },
      });

      let posts = []
      for (const post of postsResponse.data.data.children){
        posts.push(post.data);
      }
      return posts;
    } catch (error) {
      console.error('Error fetching posts from Reddit:', error.response?.data || error.message);
      return null;
    }
  }  

  private async requestAccessToken() {
    const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', null, {
      auth: {
        username: process.env.REDDIT_CLIENT_ID,
        password: process.env.REDDIT_CLIENT_SECRET,
      },
      params: {
        grant_type: 'password',
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
      },
      headers: {
        'User-Agent': process.env.REDDIT_USERAGENT,
      },
    });

    return tokenResponse.data;
  }

  async fetchPostsFromReddit(): Promise<string[]> {
    try {
      const result = await new Promise<string>((resolve, reject) => {
        exec('python3.10 ./reddit_client.py', (error, stdout, stderr) => {
          if (error) {
            console.error('Error occurred while fetching posts from Reddit:', error);
            reject(error);
          } else if (stderr) {
            console.error('Error occurred while fetching posts from Reddit:', stderr);
            reject(new Error(stderr));
          } else {
            resolve(stdout);
          }
        });
      });
      return result.trim().split('\n');
    } catch (error) {
      console.error('Failed to fetch posts from Reddit:', error);
      return [];
    }
  }
}

