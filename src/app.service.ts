import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './abi.json';
@Injectable()
export class AppService {
  getLastBlock(blockHashOrBlockTag: string): Promise<ethers.providers.Block> {
    return ethers.getDefaultProvider('goerli').getBlock(blockHashOrBlockTag);
  }
  // provider: ethers.providers.BaseProvider;

  // getBlock(blockHashOrBlockTag: string): Promise<ethers.providers.Block> {
  //   return ethers.getDefaultProvider('goerli').getBlock(blockHashOrBlockTag);
  // }

  // getContractAddress(address: string) {
  //   const contact = new ethers.Contract(address, tokenJson.abi, this.provider);
  //   return contact.;
  // }
}
