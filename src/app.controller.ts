import { Controller, Get, Param } from '@nestjs/common';
import { Hash } from 'crypto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock('latest');
  }
  @Get('block/:hash')
  getBlock(@Param('hash') hash: string) {
    return this.appService.getLastBlock(hash);
  }

  // @get('address')
  // getContractAddress()
}
