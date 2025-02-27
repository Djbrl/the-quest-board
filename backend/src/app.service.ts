import { Injectable, OnApplicationShutdown, OnModuleInit, OnModuleDestroy, Scope } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { JobsService } from './jobs/jobs.service';

@Injectable({ scope: Scope.DEFAULT }) // Set the scope to singleton
export class AppService implements OnApplicationShutdown, OnModuleInit, OnModuleDestroy {
  private jobsService: JobsService;
  private emailService: EmailService;

  private preparedResponse: Array<any>;
  private fetchIntervalId: any;
  private refreshTimer: number;

  constructor() {
    this.refreshTimer = 1000 * 60 * 3;
    this.preparedResponse = [];
    this.jobsService = new JobsService
    this.emailService = new EmailService
  }
  async onModuleInit() {
    // await this.jobsService.onModuleInit()
    await this.startPeriodicFetching()
  }

  async onApplicationShutdown() {
    await this.startPeriodicFetching();
    clearInterval(this.fetchIntervalId)
    delete this.jobsService
    delete this.emailService
  }

  async onModuleDestroy() {
    await this.startPeriodicFetching(); 
    clearInterval(this.fetchIntervalId)
    delete this.jobsService
    delete this.emailService
  }

  private async startPeriodicFetching() {
    // Initial fetch
    this.preparedResponse = await this.jobsService.getJobsFromPages();
    // Set up periodic fetching
    this.fetchIntervalId = setInterval(async () => {
      this.preparedResponse = await this.jobsService.getJobsFromPages();
      console.log("prepared response refreshed")
    }, this.refreshTimer);
  }

  //-----------------------------//

  async getQuests() {
    if (this.preparedResponse.length !== 0){
      return this.preparedResponse
    } else
    return await this.jobsService.getJobsFromPages()
  }
}
