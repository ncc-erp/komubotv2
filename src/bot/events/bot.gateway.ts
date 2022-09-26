import {
  InjectDiscordClient,
  On,
  Once,
  UseGuards,
  UsePipes,
} from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ChannelType,
  Client,
  Message,
  MessageType,
  Interaction,
  Guild,
} from "discord.js";
import { DataSource, Repository } from "typeorm";
import { DiscoveryService } from "@nestjs/core";
import { MessageFromUserGuard } from "../guards/message-from-user.guard";
import { MessageToUpperPipe } from "../pipes/message-to-upper.pipe";
import { DECORATOR_COMMAND_LINE } from "../base/command.constans";
import { ClientConfigService } from "../config/client-config.service";
import DBL from "dblapi.js";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private dataSource: DataSource,
    private discoveryService: DiscoveryService,
    private clientConfigService: ClientConfigService
  ) {}

  @Once("ready")
  onReady(client: Client) {
    console.log("[KOMU] Ready");
    (async () => {
      try {
        console.log("Successfully registered application commands globally");
      } catch (error) {
        if (error) console.error(error);
      }
    })();

    (client as any).dbl = new DBL(this.clientConfigService.topgg, client);
    const activities = [
      { name: "KOMU • *help", type: "WATCHING" },
      { name: "KOMU • *help", type: "WATCHING" },
    ];
    client.user.setActivity(activities[0].name, { type: "WATCHING" as any });
    let activity = 1;
    setInterval(async () => {
      activities[2] = { name: "KOMU", type: "WATCHING" };
      activities[3] = { name: "KOMU", type: "WATCHING" };
      if (activity > 3) activity = 0;
      client.user.setActivity(activities[activity].name, {
        type: "WATCHING" as any,
      });
      activity++;
    }, 30000);
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

  @On("Interaction")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onInteraction(interaction: Interaction): Promise<void> {}

  @On("guildCreate")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onGuildCreate(guild: Guild): Promise<void> {
    console.log(
      "[32m%s[0m",
      "NEW GUILD ",
      "[0m",
      `${guild.name} [${guild.memberCount.toLocaleString()} Members]\nID: ${
        guild.id
      }`
    );
    const channel = guild.channels.cache.find(
      (c) =>
        c.permissionsFor((guild as any).me).has("SEND_MESSAGES" as any) &&
        c.permissionsFor((guild as any).me).has("EMBED_LINKS" as any) &&
        c.type === ("text" as any)
    );
    console.log(channel);
  }

  @On("guildDelete")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onGuildDelete(guild: Guild): Promise<void> {
    console.log("[32m%s[0m", "OLD GUILD ", "[0m", `${guild.name}`);
    // await guild
    //   .fetchOwner()
    //   .then((o) => {
    //     this.clientConfigService.users.cache
    //       .get(o.id)
    //       .send(
    //         ":broken_heart: | I'm sad to see that you no longer need me in your server. Please consider giving feedback to my developer so I can improve!\n\nQuick links:\n> Dashboard: **https://komu.vn/**\n> Server: https://discord.gg/SQsBWtjzTv"
    //       );
    //   })
    //   .catch(() => console.log("Could not dm owner"));
  }
}
