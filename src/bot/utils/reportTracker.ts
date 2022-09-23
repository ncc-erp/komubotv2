import axios from "axios";

export class ReportTracker {
  getUserNameByEmail(string) {
    if (string.includes("@ncc.asia")) {
      return string.slice(0, string.length - 9);
    }
  }

  getApiWfh(client, date) {
    let wfhGetApi;
    let dataWfh = [];
    try {
      wfhGetApi = axios.get(`${client.config.wfh.api_url}?date=${date}`, {
        headers: {
          securitycode: process.env.WFH_API_KEY_SECRET,
        },
      });
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
  }
}
