import {
  InjectDiscordClient,
  On,
  Once,
  UseGuards,
  UsePipes,
} from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, Client, Message, MessageType } from "discord.js";
import * as fs from "fs";
import { DataSource, Repository } from "typeorm";
import * as util from "util";

import DailyCommand from "../commands/daily.command";
import { MessageFromUserGuard } from "../guards/message-from-user.guard";
import { Daily } from "../models/daily.entity";
import { MessageToUpperPipe } from "../pipes/message-to-upper.pipe";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private dataSource: DataSource
  ) {}

  @Once("ready")
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On("messageCreate")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onMessage(message: Message): Promise<void> {
    const { client } = message;
    if (message.channel.type == ChannelType.DM) {
      // dmmessage(e, t); -fix after-
      return;
    }
    if (message.author.bot || !message.guild) return;

    // mention bot -fix after-

    let guildDB;
    if (message.content.startsWith("*")) {
      if (message.content.endsWith("*") && !message.content.includes("prefix"))
        return;
      let argument;
      if (message.content.startsWith("*")) {
        argument = message.content.slice("*".length).trim().split(/ +/);
      }
      const r = argument.shift().toLowerCase();
      const commandFile = fs
        .readdirSync("./src/bot/commands")
        .filter((file) => file.endsWith(".command.ts"))
        .filter((item) => item.split(".").shift() === r)
        .shift();
      if (!commandFile) return;
      const commandFileSliceLasPrefixTs = commandFile?.slice(
        0,
        commandFile.length - 3
      );
      // ${commandFileSliceLasPrefixTs}
      const module = require(`../commands/${commandFileSliceLasPrefixTs}`);
      if (r === module.default.prototype.name) {
        module.default.prototype.execute(
          message,
          argument,
          client,
          guildDB,
          module,
          this.dataSource
        );
      }
    }

    this.logger.log(`Incoming message: ${message.content}`);
    // await message.reply(`hello <@${message.author.id}>`);
  }
}
