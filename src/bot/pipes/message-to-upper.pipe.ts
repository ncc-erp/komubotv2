import { PipeTransform } from '@nestjs/common';
import { Message } from 'discord.js';

export class MessageToUpperPipe implements PipeTransform {
  transform([message]: [Message]): [Message] {
    return [message];
  }
}
