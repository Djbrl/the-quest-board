import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { JobsService } from './jobs/jobs.service';
import { RedditService } from './reddit/reddit.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EmailService, JobsService, RedditService],
})
export class AppModule {}
