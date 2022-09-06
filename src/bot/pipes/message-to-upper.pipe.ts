import { DiscordPipeTransform } from '@discord-nestjs/core';
import { Message } from 'discord.js';

export class MessageToUpperPipe implements DiscordPipeTransform {
  transform([message]: [Message]): [Message] {
    return [message];
  }
}
