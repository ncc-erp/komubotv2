import {
  InjectDiscordClient,
  On,
  Once,
  UseGuards,
  UsePipes,
} from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { ChannelType, Client, Message } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { DiscoveryService } from "@nestjs/core";
import { MessageFromUserGuard } from "../guards/message-from-user.guard";
import { MessageToUpperPipe } from "../pipes/message-to-upper.pipe";
import { DECORATOR_COMMAND_LINE } from "../base/command.constans";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private dataSource: DataSource,
    private discoveryService: DiscoveryService
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
      // check command and excute
      this.discoveryService.getProviders().forEach((provider) => {
        if (typeof provider !== "string") {
          const instance = provider.instance;
          if (!instance || typeof instance === "string") return;
          if (!Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)) return;
          if (
            !Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.name ||
            !Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.description
          ) {
            this.logger.error(
              "please make property name and description in decorator @CommandLine"
            );
          }
          if (
            r === Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.name
          ) {
            instance.execute(
              message,
              argument,
              client,
              guildDB,
              module,
              this.dataSource
            );
            return;
          }
        }
      });
    }
  }
}
