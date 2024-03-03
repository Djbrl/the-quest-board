import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RedditService {
  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  async getPostsFromSubreddit(url) {
    try {
      // Extract subreddit name and parameters from the URL
      // const urlParts = new URL(url);
      // const subreddit = urlParts.pathname.split('/')[2]; // Extracts subreddit name
      // const params = new URLSearchParams(urlParts.search); // Extracts query parameters
  
      // Check if the token is not set or has expired
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
        // params: {
        //   ...Object.fromEntries(params.entries()), // Add other query parameters from the URL
        //   limit:50
        // },
      });
      
      let posts = []
      for (const post of postsResponse.data.data.children){
        posts.push(post.data);
        // console.log(subreddit, ' : ', post.data.length)
      }
      // if (subreddit === "HungryArtists"){
      //   console.log("HA : ", posts)
      // }
      // console.log(Object.fromEntries(params.entries()))
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
}
