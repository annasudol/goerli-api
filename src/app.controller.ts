import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
export class createPaymentOrderDTO {
  value: number;
  secret: string;
}

export class claimPaymentOrderDTO {
  id: number;
  secret: string;
  address: string;
}
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

  @Get('supply/:address')
  getTotalSupply(@Param('address') address: string) {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance')
  getAllowance(
    @Query('address') address: string,
    @Query('owner') owner: string,
    @Query('spencer') spencer: string,
  ) {
    return this.appService.getAllowance(address, owner, spencer);
  }
  @Get('get-payment-order/:id')
  getPaymentOrder(@Param('id') id: number) {
    return this.appService.getPaymentOrder(id);
  }
  @Post('create-payment-order')
  createPaymentOrder(@Body() body: createPaymentOrderDTO) {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }
  @Post('claim-payment-order')
  claimPaymentOrder(@Body() body: claimPaymentOrderDTO) {
    return this.appService.claimPaymentOrder(
      body.id,
      body.secret,
      body.address,
    );
  }
}
