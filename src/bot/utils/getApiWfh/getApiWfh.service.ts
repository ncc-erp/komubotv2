import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";

@Injectable()
export class GetApiWfhService {
  constructor(
    private readonly clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  getUserNameByEmail(string) {
    if (string.includes("@ncc.asia")) {
      return string.slice(0, string.length - 9);
    }
  }

  async getApiWfh(client, date) {
    let wfhGetApi;
    let dataWfh = [];
    try {
      wfhGetApi = await firstValueFrom(
        this.http
          .get(`${this.clientConfigService.wfh.api_url}?date=${date}`, {
            httpsAgent: this.clientConfigService.https,
            headers: {
              // WFH_API_KEY_SECRET
              securitycode: this.clientConfigService.wfhApiKey,
            },
          })
          .pipe((res) => res as any)
      );
    } catch (error) {
      console.log(error);
    }

    if (!wfhGetApi || wfhGetApi.data == undefined) {
      return;
    }
    if (wfhGetApi && wfhGetApi.data && wfhGetApi.data.result.length > 0) {
      wfhGetApi.data.result.map((item) =>
        dataWfh.push({
          email: this.getUserNameByEmail(item.emailAddress),
          status: item.status,
        })
      );
    }
    return dataWfh;
  }
}
