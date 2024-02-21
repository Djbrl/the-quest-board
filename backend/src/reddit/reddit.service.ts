import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RedditService {
  private readonly clientId = 'XrIoJwoP0RYhkjdFJ_XJuQ';
  private readonly clientSecret = 'qCqvhYcW2utY-k9efV9ywYI0ATesOw';
  private readonly username = 'DistinguishableLotus';
  private readonly password = 'R0lalala';
  private readonly userAgent = 'tqb_v2 (by /u/DistinguishableLotus)';
  private accessToken: string | null = null;


  async getRedditAccessToken() {
    try {
      // Check if access token is already available
      if (!this.accessToken) {
        // Step 1: Get Access Token
        const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', null, {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          params: {
            grant_type: 'password',
            username: this.username,
            password: this.password,
          },
          headers: {
            'User-Agent': this.userAgent,
          },
        });

        this.accessToken = tokenResponse.data.access_token;
      }

      // You can add logic to refresh the access token when it expires

      // Step 2: Fetch posts from HungryArtists subreddit
      const subreddit = 'HungryArtists';
      const postsResponse = await axios.get(`https://oauth.reddit.com/r/${subreddit}/new`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'User-Agent': this.userAgent,
        },
      });

      const posts = postsResponse.data.data.children;

      // Process the posts as needed
      console.log('Posts from HungryArtists:', posts);

      // You can return any necessary data or perform additional operations here
      return 'Posts fetched successfully';
    } catch (error) {
      console.error('Error fetching posts from Reddit:', error.response?.data || error.message);
      throw error;
    }
  }
}
