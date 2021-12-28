import { Buffer } from 'buffer';

export default class Utils {

  static HexStringToBase64(hex: string): string {

    return Buffer.from(hex, 'hex').toString('base64')

  }

  static zeroFill(number: any, width: number, swap: boolean): string {
      width -= number.toString().length;
  
      if (width > 0) {
          return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
      }
      if(swap)
      {
          number = number.match(/.{2}/g);
          number = number.reverse().join("");
      }
      return `${number}`;
  }

}