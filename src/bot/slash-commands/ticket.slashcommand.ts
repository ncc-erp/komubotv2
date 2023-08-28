import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from "@discord-nestjs/core";
import { HttpService } from "@nestjs/axios";
import {
  ClientEvents,
} from "discord.js";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "../config/client-config.service";
import { TicketDevDto } from "../slash-commands/dto/ticketdev.dto";
import { SlashCommandPipe } from "@discord-nestjs/common";

@Command({
  name: "ticketdev",
  description: "manage ticket",
})
export class TicketSlashCommand {
  constructor(
    private httpService: HttpService,
    private clientConfigService: ClientConfigService
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: TicketDevDto,
    @EventParams() args: ClientEvents["interactionCreate"]
  ): Promise<any> {
    const topic = dto.query;
    const topicAssignee = dto.assignee;
    const interaction = args.at(0);

    try {
      if (topic === "add") {
        const topicTask = dto.task;
        await firstValueFrom(
          this.httpService.post(
            `${this.clientConfigService.ticket.api_url_create}`,

            {
              recipientemail: `${topicAssignee}@ncc.asia`,
              creatoremail: `${interaction.user.username}@ncc.asia`,
              jobname: topicTask,
            },

            {
              httpsAgent: this.clientConfigService.https,
              headers: {
                "X-Secret-Key": this.clientConfigService.ticketApiKey,
                "Content-Type": "application/json",
              },
            }
          )
        ).catch((err) => {
          console.log("Email address not found", err);
          return { content: "Email address not found", ephemeral: true };
        });
        return { content: "`✅` Ticket saved.", ephemeral: true };
      } else if (topic === "list") {
        const { data } = await firstValueFrom(
          this.httpService.get(
            `${this.clientConfigService.ticket.api_url_get}?email=${topicAssignee}@ncc.asia`,
            {
              httpsAgent: this.clientConfigService.https,
              headers: {
                "X-Secret-Key": this.clientConfigService.ticketApiKey,
              },
            }
          )
        ).catch((err) => {
          console.log("Error ", err);
          return {
            data: undefined,
          };
        });
        if (!data || !data.result)
          return {
            content: `Error while looking up for **${topicAssignee}**.`,
            ephemeral: true,
          };
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
        return { content: mess, ephemeral: true };
      } else {
        return interaction.channel
          .send("```" + "*No query ticket" + "```")
          .catch(console.error);
      }
    } catch (error) {
      console.log(error);
      return { content: "Error " + error, ephemeral: true };
    }
  }
}
