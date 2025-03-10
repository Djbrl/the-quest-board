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
    
        console.log("card grid building : ", allJobsArray.length)
        const cardsHTML = allJobsArray
        .filter((job) => {
          const now = Date.now();
          let jobTimestamp = parseInt(job.created_utc);

          const seconds = Math.floor((now / 1000) - jobTimestamp);

          console.log("created itc : ", job.created_utc, "seconds since created: ", seconds);
          return seconds < 84600; // Only include jobs from the last 23.5 hours
      })
        .map(job => {
          console.log("job to mail", job.length)
          return `
            <div class="card">
            <a href=${'https://reddit.com' + job.url} class="card-title" style="color: #dbdbdb;">${job.title}</a>
            <div class="card-content">
                <div style="color: #dbdbdb;"><strong>Subreddit</strong> ${job.permalink.split('/')[2]}</div>
                <div style="color: #dbdbdb;"><strong>Upvotes:</strong> ${job.score}</div>
                <div style="color: #dbdbdb;"><strong>Comments:</strong> ${job.num_comments}</div>
                <!-- Add more details as needed -->
              </div>
            </div>
          `;
        });
        
        console.log("jobs html : ", cardsHTML.length)
        // Wrap the cards in a container
        const gridHTML = `
          <div class="grid-container">
            ${cardsHTML.join('')}
          </div>
        `;
        if (cardsHTML.length === 0) return '';
        return gridHTML;
      }
      
      async sendEmail(subject: string, html: string) {
        if (html.length === 0) {
          return ;
        }
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.APP_EMAIL || "artquestboard@gmail.com",
            pass: process.env.APP_PASS || "rlczokbflkgjqxmj"
          }
        });
      
        const mailOptions = {
          from: process.env.APP_EMAIL || "artquestboard@gmail.com",
          to: 'sydismyname123@gmail.com',
          subject,
          html: `
            <html>
              <head>
                <style>
                  body {
                    background-color: transparent;
                  }
                  
                  .email-logo {
                    font-family: "Helvetica", sans-serif;
                    font-weight: bold;
                    font-size:50px;
                    margin-bottom: 15px;
                    text-align: center;
                    color: #e3dede;
                  }
                  
                  .email-body {
                    margin-top: 30px;
                    margin-bottom: 20px;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    padding-left: 10px;
                    padding-right: 10px;
                    color: #e3dede;
                    font-family: "Helvetica", sans-serif;
                  }
                  
                  .email-text {
                    font-family: "Helvetica", sans-serif;
                    color: #e3dede;
                  }
                  
                  .email-container {
                    text-align: center;
                    background-color: #292626;
                    padding: 20px;
                    border-radius: 10px;
                  }
                  
                  .email-title {
                    font-family: "Helvetica", sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
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
                    text-align: left;
                    border: 1px solid #5e5c5c;
                    padding: 16px;
                    margin-bottom: 16px;
                  }
                  
                  .card-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 8px;
                  }
                  
                  .card-title:hover {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-decoration: underline;
                    color: white;
                  }

                  .card-content {
                    font-size: 14px;
                  }
                  
                  .footer-link {
                    margin-top: 10px;
                    text-align: center;
                    font-weight: bold;
                  }
                  
                  a {
                    color: #dbdbdb;
                    text-decoration: none;
                    font-size:13px;
                  }
            
                  a:hover {
                    text-decoration: underline;
                  }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="email-logo">
                    <span>thequestboard</span>
                  </div>
                  <span class="email-text">New quests are on the board ! Make your move while they're still fresh.<br></span>
                  <div class="email-body">
                    <span class="email-title">Your Quests</span>
                      ${html}
                      <div class="footer-link">
                        <a href="http://localhost:3000" style="color: #dbdbdb; font-weight: bold;">See All Recent Quests</a>
                      </div>
                      <div class="footer-link">
                        <a href="http://localhost:3000">Unsubscribe</a>
                      </div>
                  </div>
                </div>
              </body>
            </html>
          `
        };
      
        await transporter.sendMail(mailOptions);
        console.log("email sent")
      }

      async subscribe(email: string): Promise<any> {
        const reso = await prisma.mailingList.findMany({})
        for (const result in reso){
          if (reso[result].email === email) {
            return {
              ok:false,
              errorMessage: 'NonUnique'
            }
          }
        }
        try {
          const res = await prisma.mailingList.create({
            data: {
              email,
            },
          });
        } catch (error) {
          return { ok:false, errorMessage: 'DbError' }
        }
        return { ok:true, errorMessage: '' }
      }

      async unsubscribe(email: string): Promise<any> {
        try {
          const existingEntry = await prisma.mailingList.findUnique({
            where: { email },
          });
      
          if (!existingEntry) {
            return {
              ok: false,
              errorMessage: 'NotFound',
            };
          }
      
          await prisma.mailingList.delete({
            where: { email },
          });
      
          return {
            ok: true,
            errorMessage: '',
          };
        } catch (error) {
          return {
            ok: false,
            errorMessage: 'DbError',
          };
        }
      }
      
}
