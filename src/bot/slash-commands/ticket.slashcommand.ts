import {
  Command,
  DiscordTransformedCommand,
  Param,
  Payload,
  TransformedCommandExecutionContext,
  UseGroup,
} from "@discord-nestjs/core";
import { HttpService } from "@nestjs/axios";
import { Transform } from "class-transformer";
import { MessagePayload, InteractionReplyOptions } from "discord.js";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "../config/client-config.service";
import { QuerySubCommand } from "./ticket-subcommand/query.subcommand";
import { TicketDevDto } from "../slash-commands/dto/ticketdev.dto";
@Command({
  name: "ticketdev",
  description: "manage ticket",
})
export class TicketSlashCommand
  implements DiscordTransformedCommand<TicketDevDto>
{
  constructor(
    private httpService: HttpService,
    private clientConfigService: ClientConfigService
  ) {}
  async handler(
    @Payload() dto: TicketDevDto,
    { interaction, collectors }: TransformedCommandExecutionContext
  ): Promise<any> {
    const topic = interaction.options.get("query").value;
    const topicAssignee = interaction.options.get("assignee").value;

    try {
      if (topic === "add") {
        const topicTask = interaction.options.get("task").value;
        await firstValueFrom(
          this.httpService.post(
            `${this.clientConfigService.ticket.api_url_create}`,

            {
              recipientemail: `${topicAssignee}@ncc.asia`,
              creatoremail: `${interaction.user.username}@ncc.asia`,
              jobname: topicTask,
            },

            {
              headers: {
                "X-Secret-Key": this.clientConfigService.ticketApiKey,
                "Content-Type": "application/json",
              },
            }
          )
        ).catch((err) => {
          console.log("Email address not found", err);
          interaction
            .reply({ content: "Email address not found", ephemeral: true })
            .catch(console.error);
          return { data: "There was an error!" };
        });
        interaction.reply({ content: "`✅` Ticket saved.", ephemeral: true });
      } else if (topic === "list") {
        const { data } = await firstValueFrom(
          this.httpService.get(
            `${this.clientConfigService.ticket.api_url_get}?email=${topicAssignee}@ncc.asia`,
            {
              headers: {
                "X-Secret-Key": this.clientConfigService.ticketApiKey,
              },
            }
          )
        ).catch((err) => {
          console.log("Error ", err);
          interaction
            .reply({
              content: `Error while looking up for **${topicAssignee}**.`,
              ephemeral: true,
            })
            .catch(console.error);
          return { data: "There was an error!" };
        });
        if (!data || !data.result) return;
        const dataJobs = data.result.map((item) => [
          item.jobId,
          item.jobName,
          item.creatorEmail,
          item.creatorUsername,
          item.status,
        ]);
        let mess = "";
        dataJobs.forEach((job) => {
          mess =
            mess +
            `jobId:${job[0]}` +
            "\n" +
            `jobName:${job[1]}` +
            "\n" +
            `creatorEmail:${job[2]}` +
            "\n" +
            `creatorUsername:${job[3]}` +
            "\n" +
            `status:${job[4]}` +
            "\n" +
            "\n";
        });
        interaction.reply({ content: mess, ephemeral: true });

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
              content: `No data for **${topicAssignee}**.`,
              ephemeral: true,
            })
            .catch(console.error);
        }
      } else {
        return interaction.channel
          .send("```" + "*No query ticket" + "```")
          .catch(console.error);
      }
    } catch (error) {
      console.log(error);
      interaction.reply({ content: "Error " + error, ephemeral: true });
      return;
    }
  }
}
