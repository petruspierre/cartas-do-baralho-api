import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch (err) {
      throw new WsException('Invalid JSON format');
    }
  }
}
