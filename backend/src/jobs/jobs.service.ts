import { Injectable, OnModuleInit} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class JobsService implements OnModuleInit {
    private emailService: EmailService;
    private browser: puppeteer.Browser;
    private pageUrls: Array<string>;
    constructor() {
        this.emailService = new EmailService
        this.pageUrls = [
            "https://www.reddit.com/r/HungryArtists/search?sort=new&restrict_sr=on&q=flair%3AHiring",
            "https://www.reddit.com/r/artcommissions/search?sort=new&restrict_sr=on&q=flair%3APatron",
            "https://www.reddit.com/r/hireanartist/search?sort=new",
            "https://www.reddit.com/r/commissions/search?sort=new",
            "https://www.reddit.com/r/DesignJobs/new/?f=flair_name%3A%22Hiring%22",
            "https://www.reddit.com/r/starvingartists/search?sort=new",
            "https://www.reddit.com/r/fantasyartists/?f=flair_name%3A%22Client%22",
            "https://www.reddit.com/r/gameDevClassifieds/search?sort=new",
            "https://www.reddit.com/r/gameDevJobs/search?sort=new",
        ];
    }

    async onModuleDestroy(signal?: string) {
        console.log("Closing Puppeteer browser...");
        if (this.browser) {
            await this.browser.close();
        }
        delete this.emailService
    }

    async onModuleInit() {
        await this.initializePuppeteer()
    }

    async onApplicationShutdown(signal?: string) {
        if (signal === 'SIGINT' || signal === 'SIGTERM'){
            console.log("Closing Puppeteer browser...");
            if (this.browser) {
                await this.browser.close();
            }
        }
        delete this.emailService
    }
      
    private async initializePuppeteer() {
        console.log("Initializing Puppeteer...");
        try {
            this.browser = await puppeteer.launch({ headless: "new" , protocolTimeout: 30000});
        } catch (error) {
            console.log("An error occured with Puppeteer : ", error)
        }
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

    private async processPost(post: string): Promise<any> {
        if (post === '') {
            return null
        }
        const fields = post.split("&quot;");
        const forhireRegex = /\[for hire\]|for_hire|_open|for_work|looking_for_[a-zA-Z0-9_]+_projects|hire_me_/i;
        const hiringRegex= /hiring_|request_|looking_for_an_|looking_to_commission|looking_to_hire|seeking_artist|seeking_an_|/i;
        const subredditRegex = /\/r\/([^\/]+)/;
        
        const job: any = { url:'', title:'', subreddit:'', date:'', timestamp:'', is_nsfw:'', comments:'', upvotes: ''};
        for (let i = 0; i < fields.length; i++) {
          if (fields[i] === 'url') {
            if (forhireRegex.test(fields[i + 2]) && !(/hiring_/).test(fields[i + 2])) continue ;
            if (!hiringRegex.test(fields[i + 2])) continue ;
            job.url = (fields[i + 2]);
            job.subreddit = fields[i + 2].match(subredditRegex);
          }
          else if (fields[i] === 'title') {
              job.title = (fields[i + 2]);
            }
          else if (fields[i] === 'created_timestamp') {
            job.date = this.timeAgo(fields[i + 1].substring(1)).estimate;
            job.timestamp = fields[i + 1].substring(1);
          }
          else if (fields[i] === 'nsfw') {
            job.is_nsfw = (fields[i + 1].substring(1, fields[i + 1].length - 1));
          }
          else if (fields[i] === 'number_comments') {
            job.comments = (fields[i + 1].substring(1, fields[i + 1].length - 1));
          }
          else if (fields[i] === 'score') {
            job.upvotes = (fields[i + 1].substring(1, fields[i + 1].length - 1));
          }
        }

        const time = this.timeAgo(job.timestamp)
        if (job.is_nsfw === "false" && time.estimate !== "Over a week ago" && job.url !== '') {
          return job;
        } else {
          return null;
        }
    }

    //-----------------------------//

    async fetchPageContent(url: string): Promise<string> {
        let page:puppeteer.Page;
        try {
            page = await this.browser.newPage();
        } catch (error) {
            console.log("Puppeteer Error :", error)
            return ''
        }
    
        console.log("going to page...")
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        } catch (error) {
            console.log('Puppeteer Error :', error)
            return ''
        }
        
        console.log("scrolling...")
        for (let i = 0; i < 1; i++) {
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
        }
    
        console.log("fetching the content...")
        try {
            const htmlContent = await page.content();
            console.log("content fetched")
            return htmlContent;
        } catch (error) {
            console.log("failed to fetch content")
            return ''
        }
    }
    
    async getJobsFromPages() {
        let allJobsArray: any[] = [];
        
        console.log("fetching your quests")
        const fetchPromises = this.pageUrls.map(async (url) => await this.fetchPageContent(url));
        const pages = await Promise.all(fetchPromises);
        for (const page of pages) {
          if (page === ''){
            console.log("Couldn't fetch, skipping...")
            continue ;
          }
          const pageData = page.split('</head>')[1].split('\n');
          const hiringPosts = pageData.filter(line => line.includes('<faceplate-tracker source="search" action="view" noun="post"'));
          const jobPromises = hiringPosts.map(post => this.processPost(post));
          const jobsArray = (await Promise.all(jobPromises)).filter(job => job !== null);
          allJobsArray.push(...jobsArray);
        }
          allJobsArray.sort((jobA, jobB) => {
          const dateA = parseInt(jobA.timestamp);
          const dateB = parseInt(jobB.timestamp);
          return dateB - dateA;
        });
        
        const nicheRegex = /\b(DnD|D&D|Fantasy|Semi-realistic|Semi-realism|semi realism|concept art|character|homebrew|TTRPG)\b|\$\d{2,3}\$/i;
        const recentJobs = allJobsArray.filter(job => this.timeAgo(job.timestamp).seconds < 3600)
        const nicheGigs = recentJobs.filter(gig => nicheRegex.test(gig.title));
        const hotGigs = recentJobs.filter(gig => gig.comments > 15)
        // if (hotGigs.length > 0){
        //     await this.emailService.sendEmail('Hot Gig Alert ! ⚔️', this.emailService.generateCardGrid(hotGigs));
        // }
        // if (nicheGigs.length > 0){
        //     await this.emailService.sendEmail('New Quests Available ! ⚔️', this.emailService.generateCardGrid(nicheGigs));
        // }
        return allJobsArray
      }
}
