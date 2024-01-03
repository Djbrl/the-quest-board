import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EmailService {
    private readonly prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();
    }

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

      async subscribe(email: string): Promise<any> {
        const reso = await prisma.mailingList.findMany({})
        for (const result in reso){
          console.log(reso[result].email)
          if (reso[result].email === email) {
            return {ok:true, errorMessage: 'NonUnique'}
          }
        }
        try {
          const res = await prisma.mailingList.create({
            data: {
              email,
            },
          });
          console.log(res)
        } catch (error) {
          console.log(error)
          return {ok:true, errorMessage: 'DbError'}
        }
        return {ok:false, errorMessage: ''}
      }
}
