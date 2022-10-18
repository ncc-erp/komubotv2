import { TransformPipe } from "@discord-nestjs/common";
import {
  Command,
  DiscordTransformedCommand,
  InjectDiscordClient,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder, Message } from "discord.js";
import { Repository } from "typeorm";
import { KeepDto } from "./dto/keep.dto";
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
@UsePipes(TransformPipe)
export class WikiSlashCommand implements DiscordTransformedCommand<WikiDto> {
  constructor(
    @InjectRepository(Wiki)
    private wikiData: Repository<Wiki>,
    private clientConfigService: ClientConfigService,
    @InjectRepository(Keep) private keepData: Repository<Keep>,
    @InjectRepository(User) private userData: Repository<User>,
    private httpService: HttpService
  ) {}

  async handler(
    @Payload() dto: WikiDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<any> {
    try {
      let topic = interaction.options.get("topic").value as string;
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
        interaction
          .reply({
            content:
              "Available commands: \n" +
              "`@user` " +
              supportTypes.map((x) => `\`${x}\``).join(" "),
            ephemeral: true,
          })
          .catch(console.error);
        return;
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
            interaction
              .reply({ content: "No data", ephemeral: true })
              .catch(console.error);
            return;
          }
          let result = "```\n";
          keeps.forEach((doc) => {
            result += `${doc.note}\n`;
          });
          result += "```";
          interaction
            .reply({ content: result, ephemeral: true })
            .catch(console.error);
        } catch (error) {
          interaction.reply({ content: "Error", ephemeral: true });
          return;
        }
        return;
      }
      if (topic.substring(0, 2) == "<@" && topic.substring(20) == ">") {
        topic = topic.substring(2, 20);
        const userdb = await this.userData
          .createQueryBuilder("user")
          .where("id = :id", { id: topic })
          .andWhere("email IS NOT NULL")
          .andWhere("deactive IS NOT TRUE")
          .getRawOne();

        if (userdb == null) {
          interaction
            .reply({ content: "Email not found.", ephemeral: true })
            .catch(console.error);
          return;
        }

        const { data } = await firstValueFrom(
          this.httpService.get(
            `${this.clientConfigService.wiki.api_url}${userdb.email}@ncc.asia`,
            {
              headers: {
                "X-Secret-Key": this.clientConfigService.wikiApiKeySecret,
              },
            }
          )
        ).catch((err) => {
          console.log("Error ", err);
          interaction
            .reply({
              content: `Error while looking up for **${userdb.email}**.`,
              ephemeral: true,
            })
            .catch(console.error);
          return { data: "There was an error!" };
        });

        if (
          data == null ||
          data == undefined ||
          data.length == 0 ||
          data.result == null ||
          data.result == undefined ||
          data.result.length == 0
        ) {
          return interaction
            .reply({
              content: `No data for **${userdb.email}**.`,
              ephemeral: true,
            })
            .catch(console.error);
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
        interaction
          .reply({ embeds: [embed], ephemeral: true })
          .catch((err) => console.log(err));
        return;
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
          interaction.reply({ content: "No data", ephemeral: true });
          return;
        }
        let result = "```\n";
        wikis.forEach((doc) => {
          result += `${doc.name}\n`;
          result += `${doc.value}\n\n`;
        });
        result += "```";
        interaction.reply({ content: result, ephemeral: true });
        return;
      } catch (error) {
        interaction.reply({ content: "Error", ephemeral: true });
        return;
      }
    } catch (err) {
      console.log(err);
      interaction.reply({ content: "Error " + err, ephemeral: true });
      return;
    }
  }
}
