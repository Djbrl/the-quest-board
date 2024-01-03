import { Controller, Get, Query, Req, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express'
import { EmailService } from './email/email.service';

interface cachedResponse {
  jobs : Array<any>,
  timestamp : number,
  ip : string,
  apiCalls: number,
  banTimer: number
}

let requestHistory:Array<cachedResponse> = []

@Controller({ scope: Scope.DEFAULT })
export class AppController {
  private readonly startTime:number;
  private requestHistory = [];

  constructor(private readonly appService: AppService, private readonly emailService: EmailService) {
    this.startTime = Date.now()
  }

  @Get('/subscribeToMailingList')
  async subToMailingList(@Query('email') email: string): Promise<any>{
    return await this.emailService.subscribe(email)
    
  }

  @Get('/getQuests')
  async getQuests(@Req() req: Request): Promise<any> {
    const now = Date.now();
    const ip = req.ip;

    // Clear history if more than 4 hours have passed
    const cacheResetTimer = Math.floor((now - this.startTime) / 1000);
    if (cacheResetTimer > 3600 * 4) {
      this.requestHistory = [];
    }

    // Check if the IP is banned
    const bannedRequest = this.requestHistory.find(request => request.ip === ip && request.banTimer > now);
    if (bannedRequest) {
      console.log("Slow down! You've been banned for ", Math.floor((bannedRequest.banTimer - now) / 1000), "seconds");
      console.log(this.requestHistory)
      return [];
    }

    // Check if the IP is known and within the rate limit
    const knownRequest = this.requestHistory.find(request => request.ip === ip);
    if (knownRequest) {
      const seconds = Math.floor((now - knownRequest.timestamp) / 1000);
      if (seconds < 60) {
        console.log("Known IP! Your last request was only ", seconds, "ago, sending cached response");
        knownRequest.apiCalls += 1;
        if (knownRequest.apiCalls > 20) {
          knownRequest.banTimer = now + 600 * 1000; // Ban for 10 minutes
          console.log("Slow down! You've been banned for ", Math.floor((knownRequest.banTimer - now) / 1000), "seconds");
          return [];
        }
        return knownRequest.jobs;
      }
    }

    // If IP is not known or not within the rate limit, make the actual API call
    const response = await this.appService.getQuests();
    this.requestHistory.push({
      jobs: response,
      timestamp: now,
      ip: ip,
      apiCalls: 0,
      banTimer: 0,
    });

    console.log("job done!")

    return response;
  }
}
