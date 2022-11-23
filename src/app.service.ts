import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './erc20_standard.json';

export class PaymentOrderModel {
  id: number;
  value: number;
  secret: string;
  constructor(id: number, value: number, secret: string) {
    this.id = id;
    this.value = value;
    this.secret = secret;
  }
}
@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  paymentOrders: PaymentOrderModel[];

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
    this.paymentOrders = [];
  }

  getLastBlock(blockHashOrBlockTag: string): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockHashOrBlockTag);
  }

  async getTotalSupply(address: string) {
    const contact = new ethers.Contract(address, tokenJson.abi, this.provider);
    const bn = await contact.totalSupply();
    return ethers.utils.formatEther(bn);
  }

  getAllowance(address: string, owner: string, spender: string) {
    const contact = new ethers.Contract(address, tokenJson.abi, this.provider);
    const allowance = contact.allowance(owner, spender);
    return allowance;
  }

  getPaymentOrder(id: number) {
    return { id, value: this.paymentOrders[id] };
  }

  createPaymentOrder(value: number, secret: string) {
    const id = this.paymentOrders?.length || 0;
    const newPaymentModel = new PaymentOrderModel(id, value, secret);
    this.paymentOrders.push(newPaymentModel);
    return id;
  }

  async claimPaymentOrder(id: number, secret: string, address: string) {
    if (secret !== this.paymentOrders[id].secret) {
      throw new HttpException('Wrong secret', 403);
    }
    //const seed = process.env.MEMONIC;
    const seed = this.configService.get<string>('MEMONIC');
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    const wallet = ethers.Wallet.fromMnemonic(seed);
    const signer = wallet.connect(this.provider);
    const contractInstance = new ethers.Contract(
      contractAddress,
      tokenJson.abi,
      signer,
    );
    const value = ethers.utils.parseEther(
      this.paymentOrders[id].value.toString(),
    );
    const tx = await contractInstance.mint(address, value);
    tx.wait();
  }
  async getTransaction(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    return await tx.wait();
  }

  async getTransactionStatus(hash: string) {
    const tx = await this.getTransaction(hash);
    return tx.status;
  }
}
