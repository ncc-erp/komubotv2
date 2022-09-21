import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { KomubotrestController } from "../../utils/komubotrest/komubotrest.controller";
import { HeyboyService } from "./heyboy.service";

@CommandLine({
  name: "chuc",
  description: "create a poll",
})
export class HeyboyCommand implements CommandLineClass {
  constructor(
    private komubotrestController: KomubotrestController,
    private heyboyService: HeyboyService
  ) {}
  getUserNameByEmail(string) {
    if (string.includes("@ncc.asia")) {
      return string.slice(0, string.length - 9);
    }
  }
  private Embed = new EmbedBuilder()
    .setTitle("Hey Boy 💋")
    .setDescription(
      "Hôm nay mồng 8 tháng 3" +
        "\n" +
        "Các anh đừng quên mua ngay món quà" +
        "\n" +
        "Tặng mẹ tặng vợ liền tay" +
        "\n" +
        "Tặng cả đồng nghiệp hay hay team mình." +
        "\n" +
        "Xin mời các anh zai em zai hãy mua ngay tà tưa để tặng hội chị em NCC LIỀN" +
        "\n" +
        "NGAY VÀ LẬP TỨC"
    )
    .setColor(0xed4245)
    .setImage(
      "https://media.discordapp.net/attachments/921593472039915551/950589987093618779/17f8c1fe0da2bc7bffc9b62817d9143fdau-nam-tha-tim-yeu-lam.png"
    );
  private EmbedWomenDay = new EmbedBuilder()
    .setTitle("Happy Women's Day 💋")
    .setDescription(
      "Sắp đến mùng 8 tháng 3 \n Giá hoa thì đắt giá quà thì cao" +
        "\n" +
        "Tiền lương tiêu hết hồi nào" +
        "\n" +
        "Bonus thì lại chẳng trao dịp này" +
        "\n" +
        "Thôi thì có tấm thân gầy" +
        "\n" +
        "Nguyện trao gửi phận đến tay ai cần" +
        "\n" +
        "Cùng những lời chúc có vần" +
        "\n" +
        "Một trái tim nhỏ, ngàn lần yêu thương" +
        "\n" +
        "Chúc cho may mắn đủ đường" +
        "\n" +
        "Chị em đến tháng......lĩnh lương nhiều nhiều" +
        "\n" +
        "Ung dung chẳng nghĩ tiền tiêu" +
        "\n" +
        "Công việc thuận lợi mọi điều hanh thông" +
        "\n" +
        "Đến tuổi chúc sớm lấy chồng" +
        "\n" +
        "Gia đình hạnh phúc thành công mọi đường" +
        "\n" +
        "Chị em chưa có người thương" +
        "\n" +
        "Sớm có thằng rước thuận đường tình duyên" +
        "\n" +
        "Anh em phải nhớ không quên" +
        "\n" +
        "Chị em mãi đẹp nữ quyền lên ngôi." +
        "\n" +
        "*From NCC8 with Love*"
    )
    .setColor(0xed4245)
    .setFooter({
      text: "Mãi iu 💋",
    })
    .setImage(
      "https://media.discordapp.net/attachments/921593472039915551/950241681041670164/unknown.png"
    );
  async execute(message, args, client) {
    console.log("chuc 8/3");
    if (args[0] !== "mung" || args[1] !== "ngay" || args[2] !== "8/3") return;
    const ID_USER_PRIVATE = "869774806965420062";
    // if (message.author.id !== ID_USER_PRIVATE) {
    //   return message.reply("Missing permissions");
    // }
    await this.komubotrestController.sendMessageToNhaCuaChung(client,
     this.EmbedWomenDay
    , message);
    await this.komubotrestController.sendMessageToNhaCuaChung(client, 
    this.Embed
    , message);
    console.log('running')
    const response = await axios.get(
      "http://timesheetapi.nccsoft.vn/api/services/app/Public/GetAllUser"
    );
    console.log('where are u')
    if (!response.data || !response.data.result) {console.log("respon data error") ;return;}
      console.log("hello bro")
    const emailsWoman = response.data.result
      .filter((user) => user.sex === 0)
      .map((item) => this.getUserNameByEmail(item.emailAddress));

    //! Các câu lệnh find không trả về kết quả do db đang trống
    const userWoman = await this.heyboyService.findWomanUser(emailsWoman);
    console.log('userWoman : ', userWoman);
    await Promise.all(
      userWoman.map((user) =>
        this.komubotrestController.sendMessageKomuToUser(
          client,
          { embeds: [this.Embed] },
          user.email
        )
      )
    );
  }
}
