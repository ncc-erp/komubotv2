import { HttpService } from "@nestjs/axios";
import { Client, Message } from "discord.js";
import { firstValueFrom } from "rxjs";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";

@CommandLine({
  name: "bzz",
  description: "send message",
  cat: "komu",
})
export class BzzCommand implements CommandLineClass {
  constructor(
    private komuborestController: KomubotrestService,
    private readonly http: HttpService,
    private clientConfigService: ClientConfigService
  ) {}

  async execute(message: Message, args, client: Client) {
    try {
      if (args[0]) {
        try {
          const { data } = await firstValueFrom(
            this.http
              .get(
                `${this.clientConfigService.phonenumber.api_url}${args[0]}@ncc.asia`,
                {
                  headers: {
                    "X-Secret-Key": this.clientConfigService.hrmApiKey,
                  },
                }
              )
              .pipe((res) => res)
          ).catch((err) => {
            console.log("Error ", err);
            return { data: "There was an error!" };
          });
          if (!data || !data.result) return;
          await firstValueFrom(
            this.http
              .post(this.clientConfigService.sendSms, {
                tel: data.result.phoneNumber,
                timeout: 10,
              })
              .pipe((res) => res)
          ).catch((err) => {
            console.log("Error ", err);
            return { data: "There was an error!" };
          });
        } catch (error) {}
      }
    } catch (error) {}
  }
}
