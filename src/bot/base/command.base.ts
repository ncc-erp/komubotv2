import { Client, Message } from "discord.js";
import { DataSource } from "typeorm";
import { DECORATOR_COMMAND_LINE } from "./command.constans";

export interface CommandLineArgument {
  name: string;
  description: string;
  cat: string;
}
export class CommandLineClass {
  execute: (
    message: Message,
    argument: any,
    client: Client,
    guildDB: any,
    module: any,
    dataSource: DataSource
  ) => void;
}
export function CommandLine(args: CommandLineArgument) {
  return function (constructor: Function) {
    Reflect.defineMetadata(DECORATOR_COMMAND_LINE, args, constructor.prototype);
  };
}
