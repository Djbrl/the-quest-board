import { Injectable, OnModuleInit} from '@nestjs/common';
import { all } from 'axios';
import * as puppeteer from 'puppeteer';
import { EmailService } from 'src/email/email.service';
import { RedditService } from 'src/reddit/reddit.service';

let hotGigsHistory = []
let jobsHistory = []

@Injectable()
export class JobsService implements OnModuleInit {
    private emailService: EmailService;
    private redditService: RedditService;
    private pageUrls: Array<string>;
    constructor() {
        this.emailService = new EmailService
        this.redditService = new RedditService
        this.pageUrls = [
            "r/HungryArtists/search?sort=new&restrict_sr=on&q=flair%3AHiring",
            "r/artcommissions/search?sort=new&restrict_sr=on&q=flair%3APatron",
            "r/hireanartist/search?sort=new",
            "r/commissions/search?sort=new",
            "r/DesignJobs/new/?f=flair_name%3A%22Hiring%22",
            "r/starvingartists/search?sort=new",
            "r/fantasyartists/?f=flair_name%3A%22Client%22",
            "r/gameDevClassifieds/search?sort=new",
            "r/gameDevJobs/search?sort=new",
        ];
    }

    async onModuleDestroy(signal?: string) {
        delete this.emailService
    }

    async onModuleInit() {
    }

    async onApplicationShutdown(signal?: string) {
        delete this.emailService
    }

    private timeAgo(timestamp: string) {
        const now = Date.now();
        const seconds = Math.floor((now - parseInt(timestamp)) / 1000);
        const periods = [
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
        ];
        
        if (seconds > 86400 * 7){
          return { estimate: 'Over a week ago', seconds: seconds}
        }
        for (const period of periods) {
          const count = Math.floor(seconds / period.seconds);
          if (count >= 1) {
            return count === 1 ? { estimate: `${count} ${period.label} ago`, seconds: seconds} : { estimate: `${count} ${period.label}s ago`, seconds: seconds};
          }
        }
        return { estimate: 'just now', seconds: seconds};
    }
    
    async getJobsFromPages() {
      console.log("fetching your quests");
    
      // Use Promise.all to fetch posts from all subreddits concurrently
      const fetchPromises = this.pageUrls.map(async (sub) => {
        const posts = await this.redditService.getPostsFromSubreddit(sub);
        return posts;
      });
    
      const pages = await Promise.all(fetchPromises);
      
      // Flatten the array of arrays into a single array of posts
      const allPosts = [].concat(...pages);
    
      // Filter posts based on certain conditions
      const jobsArray = allPosts.filter(job => !job.over_18);
      console.log("posts fetched : ", allPosts.length)
      console.log("posts sfw : ", jobsArray.length)
    
      const forhireRegex = /for_hire|hire_me_|_writer|_ux_|_ui_|_uxui|_uiux|_web|_branding|user_experience|graphic_design|_unity|_ue5|unreal_engine|_programmer/i;
      const hiringRegex = /\/hiring_|\/client_|\/request_|\/patron_|\/paid_|looking_for_an_|l4_artist|lf_artist|who_can|looking_for_[a-zA-Z0-9_]+_artist|looking_for_[a-zA-Z0-9_]+_animator|looking_to_commission|looking_to_hire|looking_to_have|looking_to_get|seeking_[a-zA-Z0-9_]+_artist|seeking_artist|seeking_an_/i;
    
      // Filter posts based on regex conditions
      let processedPosts = jobsArray.filter(job => {
        if (!hiringRegex.test(job.permalink) || forhireRegex.test(job.permalink)) {
          return false;
        }
        return true;
      });
  

      console.log("relevant psots : ", processedPosts.length);
    
      processedPosts.sort((jobA, jobB) => {
        const dateA = parseInt(jobA.created_utc);
        const dateB = parseInt(jobB.created_utc);
        return dateB - dateA;
      });
    
      const nicheRegex = /\b(DnD|D&D|Fantasy|Semi-realistic|Semi-realism|semi realism|concept art|character|homebrew|TTRPG)\b|\$\d{2,3}\$/i;
      const recentJobs = processedPosts.filter(job => this.timeAgo(job.timestamp).seconds < 3600);
      const nicheGigs = recentJobs.filter(gig => nicheRegex.test(gig.title));
      const hotGigs = recentJobs.filter(gig => gig.num_comments >= 15);
    
      if (jobsHistory.length === 0) {
        jobsHistory = processedPosts;
      }
    
      if (hotGigsHistory.length === 0) {
        hotGigsHistory = hotGigs;
      }
    
      const newPosts = processedPosts.length - jobsHistory.length;
      
      if (newPosts >= 3) {
        await this.emailService.sendEmail('New Quests Are In ! ⚔️', this.emailService.generateCardGrid(processedPosts.filter(itemB => !jobsHistory.includes(itemB)).slice(0, 5)));
        jobsHistory = processedPosts;
      }
    
      if (hotGigs.length > hotGigsHistory.length) {
        await this.emailService.sendEmail('Hot Gig Alert ! ⚔️', this.emailService.generateCardGrid(hotGigs.filter(itemB => !hotGigsHistory.includes(itemB))));
        hotGigsHistory = hotGigs;
      }
    
      if (nicheGigs.length > 0) {
        await this.emailService.sendEmail('New Quests Available ! ⚔️', this.emailService.generateCardGrid(nicheGigs));
      }
    
      return processedPosts;
    }
    }
