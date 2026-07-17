import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(@Session() session: UserSession) {
    return session.user;
  }
}
