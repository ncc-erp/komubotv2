import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "../config/client-config.service";

export class GetApiWfh {
  constructor(
    private readonly clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  getUserNameByEmail(string) {
    if (string.includes("@ncc.asia")) {
      return string.slice(0, string.length - 9);
    }
  }

  getApiWfh = async (client, date) => {
    let wfhGetApi;
    let dataWfh = [];
    try {
      wfhGetApi = await firstValueFrom(
        this.http
          .get(`${this.clientConfigService.wfh.api_url}?date=${date}`, {
            headers: {
              securitycode: process.env.WFH_API_KEY_SECRET,
            },
          })
          .pipe((res) => res)
      );
    } catch (error) {
      console.log(error);
    }

    if (!wfhGetApi || wfhGetApi.data == undefined) {
      return;
    }
    wfhGetApi.data.result.map((item) =>
      dataWfh.push({
        email: this.getUserNameByEmail(item.emailAddress),
        status: item.status,
      })
    );
    return dataWfh;
  };
}
