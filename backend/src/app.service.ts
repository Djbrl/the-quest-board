import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer'

@Injectable()
export class AppService {
  generateCardGrid(allJobsArray: any[]): string {
    
    const cardsHTML = allJobsArray
    .filter((job) => {
      const now = Date.now();
      const seconds = Math.floor((now - parseInt(job.timestamp)) / 1000);
      return seconds < 84600;
    })
    .map(job => {
      return `
        <div class="card">
          <a href=${'https://reddit.com' + job.url} class="card-title">${job.title}</a>
          <div class="card-content">
            <div><strong>Subreddit</strong> ${job.url.split('/')[2]}</div>
            <div><strong>Date:</strong> ${job.date}</div>
            <div><strong>Comments:</strong> ${job.comments}</div>
            <!-- Add more details as needed -->
          </div>
        </div>
      `;
    });
    
    // Wrap the cards in a container
    const gridHTML = `
      <div class="grid-container">
        ${cardsHTML.join('')}
      </div>
    `;
  
    return gridHTML;
  }
  
  async sendEmail(subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: 'sydismyname123@gmail.com',
      subject,
      html: `
        <html>
          <head>
            <style>
              body {
                background-color: transparent;
              }
              .email-container {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
              }
              .email-title {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
                display: block;
              }
              .grid-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
              }
              @media (max-width: 400px) {
                .grid-container {
                  grid-template-columns: 1fr;
                }
              }
              .card {
                background-color: #f0f0f0;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
              }
              .card-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 8px;
              }
              .card-content {
                font-size: 14px;
              }
              .footer-link {
                margin-top: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <span>Welcome back traveler ! New quests are available at the town hall. Come through and grab one ! <br></span>
              <span class="email-title">Your Quests</span>
              ${html}
              <div class="footer-link">
                <a href="https://www.reddit.com">Visit Reddit</a>
              </div>
            </div>
          </body>
        </html>`
    };
  
    await transporter.sendMail(mailOptions);
  }

  timeAgo(timestamp: string): string {
    const now = Date.now();
    const seconds = Math.floor((now - parseInt(timestamp)) / 1000);
    const periods = [
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    
    if (seconds > 86400 * 7){
      return 'Over a week ago'
    }
    for (const period of periods) {
      const count = Math.floor(seconds / period.seconds);
      if (count >= 1) {
        return count === 1 ? `${count} ${period.label} ago` : `${count} ${period.label}s ago`;
      }
    }
    return 'just now';
  }

  async fetchPageContent(url: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 1; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }

    const htmlContent = await page.content();
    await browser.close();
    return htmlContent;
  }

  async getJobsFromPages() {
    const pageUrls = [
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
  
    const fetchPromises = pageUrls.map(url => this.fetchPageContent(url));
  
    console.log("fetching your quest")
    const pages = await Promise.all(fetchPromises);
    const allJobsArray: any[] = [];
  
    for (const page of pages) {
      const pageData = page.split('</head>')[1].split('\n');
    
      const hiringPosts = pageData.filter(line => line.includes('<faceplate-tracker source="search" action="view" noun="post"'));
      const jobPromises = hiringPosts.map(post => this.processPost(post));
    
      const jobsArray = (await Promise.all(jobPromises)).filter(job => job !== null);
      allJobsArray.push(...jobsArray);
    }
  
    allJobsArray.sort((jobA, jobB) => {
      const dateA = parseInt(jobA.date);
      const dateB = parseInt(jobB.date);
      return dateB - dateA;
    });
    
    allJobsArray.forEach(job => job.date = this.timeAgo(job.date));
    const subject = 'New Quests Available ! ⚔️';
    return allJobsArray
    // await this.sendEmail(subject, this.generateCardGrid(allJobsArray));
  }
  
  async processPost(post: string): Promise<any> {
    const fields = post.split("&quot;");
    const forhireRegex = /\[for hire\]|for_hire|_open|hire_me_/i;
    const hiringRegex= /hiring_|request_|looking_for_|looking_to|seeking_/i;

    const job: any = {
      url: '',
      title: '',
      date: '',
      timestamp: '',
      is_nsfw: '',
      comments: '',
      upvotes: '',
    };
  
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === 'url') {
        if (forhireRegex.test(fields[i + 2]) && !(/hiring_/).test(fields[i + 2])) continue ;
        if (!hiringRegex.test(fields[i + 2])) continue ;
        job.url = (fields[i + 2]);
      }
      if (fields[i] === 'title') {
          job.title = (fields[i + 2]);
      }
      if (fields[i] === 'created_timestamp') {
        job.date = fields[i + 1].substring(1);
        job.timestamp = fields[i + 1].substring(1);
      }
      if (fields[i] === 'nsfw') {
        job.is_nsfw = (fields[i + 1].substring(1, fields[i + 1].length - 1));
      }
      if (fields[i] === 'number_comments') {
        job.comments = (fields[i + 1].substring(1, fields[i + 1].length - 1));
      }
      if (fields[i] === 'score') {
        job.upvotes = (fields[i + 1].substring(1, fields[i + 1].length - 1));
      }
    }
  
    if (job.is_nsfw === "false" && this.timeAgo(job.date) !== "Over a week ago" && job.url !== '') {
      return job;
    } else {
      return null;
    }
  }
}
