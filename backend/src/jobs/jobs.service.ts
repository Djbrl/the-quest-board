import { Injectable, OnModuleInit} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RedditService } from 'src/reddit/reddit.service';

let hotGigsHistory = []
let jobsHistory = []

@Injectable()
export class JobsService implements OnModuleInit {
    private emailService: EmailService;
    private redditService: RedditService;
    constructor() {
        this.emailService = new EmailService
        this.redditService = new RedditService
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
    
    async sendToDiscord(processedPosts:Array<any>) {
      try {
        const response = await fetch('http://localhost:3003/postHotGig', {
          method: 'POST', headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(processedPosts),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.text();
        console.log('Server response:', result);
      } catch (error) {
        console.error('Error reaching discord bot :', error);
      }
    }

    async getJobsFromPages() {
      const res = await this.redditService.fetchPostsFromReddit()
      if (res.length === 0){
        return []
      }
      const jsonString = res.join("\n");
      const jobsArray = JSON.parse(jsonString).flat().filter(job => !job.over_18);
  
      const forhireRegex = /for_hire|hire_me_|_writer|_ux_|_ui_|_uxui|_uiux|_web|_branding|user_experience|graphic_design|_unity|_ue5|unreal_engine|_programmer/i;
      const hiringRegex = /\/hiring_|\/client_|\/request_|\/patron_|\/paid_|looking_for_an_|l4_artist|lf_artist|who_can|looking_for_[a-zA-Z0-9_]+_artist|looking_for_[a-zA-Z0-9_]+_animator|looking_to_commission|looking_to_hire|looking_to_have|looking_to_get|seeking_[a-zA-Z0-9_]+_artist|seeking_artist|seeking_an_/i;

      let processedPosts = jobsArray.filter(job => {
        if (!hiringRegex.test(job.permalink) || forhireRegex.test(job.permalink)) {
          return false;
        }
        return true;
      });
  
      processedPosts.sort((jobA, jobB) => {
        const dateA = parseInt(jobA.created_utc);
        const dateB = parseInt(jobB.created_utc);
        return dateB - dateA;
      });
    
      const recentJobs = processedPosts.filter(job => this.timeAgo(job.timestamp).seconds < 3600);
      const hotGigs = recentJobs.filter(gig => gig.num_comments > 10);
      const newPosts = processedPosts.length - jobsHistory.length;
      // const nicheRegex = /\b(DnD|D&D|Fantasy|Semi-realistic|Semi-realism|semi realism|concept art|character|homebrew|TTRPG)\b|\$\d{2,3}\$/i;
      // const nicheGigs = recentJobs.filter(gig => nicheRegex.test(gig.title));

      if (newPosts){
        await this.sendToDiscord(processedPosts)
        if (hotGigs.length){
          await this.emailService.sendEmail('Hot Gig Alert ! ⚔️', this.emailService.generateCardGrid(hotGigs.filter(itemB => !hotGigsHistory.includes(itemB))));
          hotGigsHistory = hotGigs;  
        }
        await this.emailService.sendEmail('New Quests Are In ! ⚔️', this.emailService.generateCardGrid(processedPosts.filter(itemB => !jobsHistory.includes(itemB)).slice(0, 5)));
        jobsHistory = processedPosts;
      }

      if (jobsHistory.length === 0) {
        jobsHistory = processedPosts;
      }
    
      if (hotGigsHistory.length === 0) {
        hotGigsHistory = hotGigs;
      }
    
      return processedPosts;
    }
  }
