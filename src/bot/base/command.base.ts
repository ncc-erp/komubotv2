import { Client, Message } from 'discord.js';
import { DataSource } from 'typeorm';

export interface CommandLineArgument {
  name: string;
  description: string;
}
export class CommandLineClass {
  execute: (
    message: Message,
    argument: any,
    client: Client,
    guildDB: any,
    module: any,
    dataSource: DataSource,
  ) => void;
}
export function CommandLine({ name, description }: CommandLineArgument) {
  return function (constructor: Function) {
    constructor.prototype.name = name;
    constructor.prototype.description = description;
  };
}
