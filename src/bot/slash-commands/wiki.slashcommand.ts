import { SlashCommandPipe } from "@discord-nestjs/common";
import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ClientEvents,
  EmbedBuilder,
  InteractionReplyOptions,
} from "discord.js";
import { IsNull, Not, Repository } from "typeorm";
import { Keep } from "../models/keep.entity";
import { WikiDto } from "./dto/wiki.dto";
import { Wiki } from "../models/wiki.entity";
import { ClientConfigService } from "../config/client-config.service";
import { User } from "../models/user.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Command({
  name: "wiki",
  description: "show wiki",
})
export class WikiSlashCommand {
  constructor(
    @InjectRepository(Wiki)
    private wikiData: Repository<Wiki>,
    private clientConfigService: ClientConfigService,
    @InjectRepository(Keep) private keepData: Repository<Keep>,
    @InjectRepository(User) private userData: Repository<User>,
    private httpService: HttpService
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: WikiDto,
    @EventParams() args: ClientEvents["interactionCreate"]
  ): Promise<InteractionReplyOptions> {
    try {
      let topic = dto.topic;
      const interaction = args.at(0);
      let supportTypes = await this.wikiData
        .createQueryBuilder()
        .distinctOn(["type"])
        .execute();

      supportTypes = supportTypes.concat(this.clientConfigService.wiki.options);
      supportTypes = [...new Set(supportTypes)];
      topic = topic.replace(/!/g, "");
      if (
        topic == "help" ||
        (topic.substring(0, 2) != "<@" &&
          topic.substring(20) != ">" &&
          !supportTypes.includes(topic))
      ) {
        return {
          content:
            "Available commands: \n" +
            "`@user` " +
            supportTypes.map((x) => `\`${x}\``).join(" "),
          ephemeral: true,
        };
      }
      if (topic.substring(0, 4) == "note") {
        try {
          const keeps = await this.keepData.find({
            where: {
              userId: interaction.user.id,
              status: "active",
            },
          });
          if (keeps.length === 0) {
            return { content: "No data", ephemeral: true };
          }
          let result = "```\n";
          keeps.forEach((doc) => {
            result += `${doc.note}\n`;
          });
          result += "```";
          return { content: result, ephemeral: true };
        } catch (error) {
          return { content: "Error", ephemeral: true };
        }
      }
      if (topic.substring(0, 2) == "<@" && topic.substring(20) == ">") {
        topic = topic.substring(2, 20);
        const userdb = await this.userData.findOne({
          where: {
            userId: topic,
            email: Not(IsNull()),
            deactive: false,
          },
        });

        if (userdb == null) {
          return { content: "Email not found.", ephemeral: true };
        }

        const { data } = await firstValueFrom(
          this.httpService.get(
            `${this.clientConfigService.wiki.api_url}${userdb.email}@ncc.asia`,
            {
              httpsAgent: this.clientConfigService.https,
              headers: {
                "X-Secret-Key": this.clientConfigService.wikiApiKeySecret,
              },
            }
          )
        ).catch((err) => {
          console.log("Error ", err);
          return {
            data: undefined,
          };
        });

        if (!data?.result) {
          return {
            content: `No data for **${userdb.email}**.`,
            ephemeral: true,
          };
        }

        const infos = [];
        const projects = [];

        infos.push(data.result.employeeName);
        infos.push(data.result.emailAddress);
        infos.push(data.result.phoneNumber);
        infos.push(data.result.roleType);
        infos.push(data.result.branch);

        data.result.projectDtos.forEach((item) => {
          projects.push(item.projectName);
          projects.push(item.pmName);
          projects.push(item.startTime);
          projects.push(item.projectRole);
        });

        const embed = new EmbedBuilder()
          .setColor("#3A871F")
          .setTitle(data.result.employeeName)
          .addFields(
            { name: "Infos", value: infos.join("\n"), inline: false },
            {
              name: "Projects",
              value: projects.join("\n").substring(0, 1024),
              inline: false,
            }
          );
        return { embeds: [embed], ephemeral: true };
      }

      let filter = { type: topic } as any;
      if (topic == "all") {
        filter = {};
      }

      try {
        const wikis = await this.wikiData.find({
          where: filter,
        });
        if (wikis.length === 0) {
          return { content: "No data", ephemeral: true };
        }
        let result = "```\n";
        wikis.forEach((doc) => {
          result += `${doc.name}\n`;
          result += `${doc.value}\n\n`;
        });
        result += "```";
        return { content: result, ephemeral: true };
      } catch (error) {
        return { content: "Error", ephemeral: true };
      }
    } catch (err) {
      console.log(err);
      return { content: "Error " + err, ephemeral: true };
    }
  }
}
