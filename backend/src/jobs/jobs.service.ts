import { Injectable, OnModuleInit} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { EmailService } from 'src/email/email.service';

let hotGigsHistory = []
let jobsHistory = []

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
            this.browser = await puppeteer.launch({args: ['--no-sandbox'], headless: "new" , protocolTimeout: 90000});
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
        const forhireRegex = /for_hire|hire_me_|_writer|_ux_|_ui_|_uxui|_uiux|_web|_branding|user_experience|graphic_design|_unity|_ue5|unreal_engine|_programmer/i;
        const hiringRegex= /\/hiring_|\/client_|\/request_|\/patron_|\/paid_|looking_for_an_|l4_artist|lf_artist|who_can|looking_for_[a-zA-Z0-9_]+_artist|looking_for_[a-zA-Z0-9_]+_animator|looking_to_commission|looking_to_hire|looking_to_have|looking_to_get|seeking_[a-zA-Z0-9_]+_artist|seeking_artist|seeking_an_/i;
        const subredditRegex = /\/r\/([^\/]+)/;
        
        const job: any = { url:'', title:'', subreddit:'', date:'', timestamp:'', is_nsfw:'', comments:'', upvotes: ''};
        for (let i = 0; i < fields.length; i++) {
          if (fields[i] === 'url') {
            // if (forhireRegex.test(fields[i + 2])) return null ;
            if (!hiringRegex.test(fields[i + 2]) || forhireRegex.test(fields[i + 2])) return null ;
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
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      } catch (error) {
          console.log("Puppeteer Error :", error)
          await this.browser.close();
          return ''
      }

      try {
        await page.setExtraHTTPHeaders({
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "fr-FR,fr;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "rdt=d5ad960dab44bdbf2ed88627eb5bbbb7; edgebucket=erGGfy4d9u9L1jngvs; loid=000000000rqi3b0c41.2.1704831896841.Z0FBQUFBQmxuYXVZcW1qTjYxQ25HalllOG9OUFNwb1FBT2hkY2xFVnV0Y0dsNzhFMlBHdFg3QmthbklUUEhRTVRJaEpQX3lfWkR2YXZ3R3kwRVJaMHVrQXMxeFJHaVkwMl9zU1F5NjNRWUdzOEUzSHlXX05iclQ0ZTk0eHFmU3ppNnlIOGNFbXhISU4; csrf_token=c6d535f50dd0fc2ec1e36da1385d8ddf; token_v2=eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJsb2lkIiwiZXhwIjoxNzA0OTE4Mjk2Ljg0MTY5OSwiaWF0IjoxNzA0ODMxODk2Ljg0MTY5OCwianRpIjoiS2dwUFNqMThTRW1WVHlWM0UzV1ZtSEM5ZVZFRTV3IiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml9ycWkzYjBjNDEiLCJsY2EiOjE3MDQ4MzE4OTY4NDEsInNjcCI6ImVKeGtrZEdPdERBSWhkLWwxejdCX3lwX05odHNjWWFzTFFhb2szbjdEVm9jazcwN2NMNGlIUDhuS0lxRkxFMnVCS0drS1dFRld0T1VOaUx2NTh5OU9aRUZTeUZUUjg0M3l3b2thVXBQVW1ONXB5bFJ3V1prTGxmYXNVS0RCNllwVlM2WjIwS1BTNXZRM0kxRnowNk1xbHhXSHRUWW8zSnBiR01LMnhQanpjWnFReXF1eTZsTVlGa29uOFdMZnZ5Ry10WS1mN2JmaEhZd3JLZ0tEX1RPdUZ4d1lfSERGSGJfbnByMGJGMndxTDNYZzlRLTEtTjI3Yk5tb2RtNV9WelB2emFTY1RtRzVpZll2N3QtQ1IxNDVIbVpVUWN3WWcwX3lyQWo2X0N2T29ES0JRV01KWWhQSTVBcmwyX19KZGl1VGY4YXR5ZC0tR2JFVFdfNHJSbW81eExFb1VfajZ6Y0FBUF9fWERfZTR3IiwiZmxvIjoxfQ.aENrsFoiLOiJRQ1Uweqk77Xr-W92wOpdEuSs38H9JyY8Ah1gT8UifdMzqGGWPa-MY_LkTxVpOz7uazO4bpUho7fIWnPjiqvu1jzskCeFQ9gpzbS62dnTdxCjRIlwe0bF4lyjvFgXK2lcBYLlY2Xo8jgWwy3jnhDU6ziwLtI6RpqnjPRSn-UJrBdRyn6mAZ-UX_kalE_lnl_D11YWuZKnXa22YhoEa_U9Fnnr9r_cVlvU3Ejkbya-_Yq1nc7gdEDXbp_JWWpR1I2D2kiB47aVbzA7CvGrlGgqbM5c1xmjZtWw0gGHM5nVeJgZu_P8uWgdGY5WP2hWubuy4up9eAGmQ; csv=2; session_tracker=qdbflmpjnnpmpobphp.0.1704832025754.Z0FBQUFBQmxuYXdaZVVpU2p0NjlrQ2dxd1NUS1RNeDJ0NXlVNEdlUFlucXR2VTgwTGotMlVGRDF5RDQtS24zR3FhNVMtQXQ5YnpIM0E5dFpVYi12SV9qcGtrZ2xNQjBFZjJ4RHlaR2pKZEc4Ujh4NVZ0elVkMDY2Y0hFMjZOZTQ3NUdjb3RYY2Nub2I",
            "Referer": url,
            "Referrer-Policy": "strict-origin-when-cross-origin"});
      } catch (error) {
          console.log('Puppeteer Error:', error);
          return '';
      }

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      } catch (error) {
          console.log('Puppeteer Error :', error)
          return ''
      }

      console.log("fetching the content...")
      const randomDelay = Math.floor(Math.random() * (1500 - 700 + 1) + 700); // Random delay between 700 and 1500 ms
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      await page.evaluate( async () => { window.scrollTo(0, document.body.scrollHeight) });
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
          console.log("Couldn't fetch, skipping this url...")
          continue ;
        }
        const pageData = page.split('</head>')[1].split('\n');
        const hiringPosts = pageData.filter(line => line.includes('<faceplate-tracker source="search" action="view" noun="post"'));
        const jobPromises = hiringPosts.map(post => this.processPost(post));
        const jobsArray = (await Promise.all(jobPromises)).filter(job => job !== null);
        allJobsArray.push(...jobsArray);
      }
      allJobsArray = allJobsArray.map(job => {
        return {
          ...job,
          title: job.title.replace(/&amp;/g, "&")
        };
      })
      allJobsArray.sort((jobA, jobB) => {
        const dateA = parseInt(jobA.timestamp);
        const dateB = parseInt(jobB.timestamp);
        return dateB - dateA;
      });
      
      const nicheRegex = /\b(DnD|D&D|Fantasy|Semi-realistic|Semi-realism|semi realism|concept art|character|homebrew|TTRPG)\b|\$\d{2,3}\$/i;
      const recentJobs = allJobsArray.filter(job => this.timeAgo(job.timestamp).seconds < 3600)
      const nicheGigs = recentJobs.filter(gig => nicheRegex.test(gig.title));
      const hotGigs = recentJobs.filter(gig => gig.comments >= 15)
      // if (jobsHistory.length === 0){
      //   jobsHistory = allJobsArray
      // }
      // if (hotGigsHistory.length === 0){
      //   hotGigsHistory = hotGigs
      // }

      const newPosts = allJobsArray.length - jobsHistory.length
      if (newPosts >= 3){
        await this.emailService.sendEmail('New Quests Are In ! ⚔️', this.emailService.generateCardGrid(allJobsArray.filter(itemB => !jobsHistory.includes(itemB)).slice(0,5)));
        jobsHistory = allJobsArray
      }

      if (hotGigs.length > hotGigsHistory.length){
        await this.emailService.sendEmail('Hot Gig Alert ! ⚔️', this.emailService.generateCardGrid(hotGigs.filter(itemB => !hotGigsHistory.includes(itemB))));
        hotGigsHistory = hotGigs
      }
      // if (nicheGigs.length > 0){
      //     await this.emailService.sendEmail('New Quests Available ! ⚔️', this.emailService.generateCardGrid(nicheGigs));
      // }
      return allJobsArray
    }
}
