import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.BACKEND_CONTAINER_PORT);
}
bootstrap();

//TODO :

//DONE basic rate limiter done
//V1 DONE, fix doubel texting and add cooldown sysstem hot gig alerts
//V1 DONE, ifx doubel texting and add cooldown systemniche alert

//user accounts
//priority api requests (no cache)

//do middleware rate limiter next
//do redis caching