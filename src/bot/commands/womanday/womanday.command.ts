import axios from "axios";
import { Message , Client} from "discord.js";

import { CommandLine, CommandLineClass } from "../../base/command.base";
import { ActionRowBuilder, ButtonBuilder , EmbedBuilder} from "discord.js";
import { WomanDayService } from "./womanday.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";



@CommandLine({
  name: "happy",
  description: "create a poll",
  cat: 'komu',
})
export class WomanDayCommand implements CommandLineClass {
    constructor(  private WomanDayService : WomanDayService, private komubotrestController: KomubotrestService) {
      
    }
     getUserNameByEmail(string) {
        if (string.includes('@ncc.asia')) {
          return string.slice(0, string.length - 9);
        }
      }
    async execute(message, args, client) {
        try {
          console.log('womanday happy')
          if (args[0] !== "women's" || args[1] !== 'day') return;
          const response = await axios.get(
            'http://timesheetapi.nccsoft.vn/api/services/app/Public/GetAllUser'
          );
          if (!response.data || !response.data.result) return;
          const userWomenTest = response.data.result
            .filter((user) => user.sex === 1)
            .map((item) => this.getUserNameByEmail(item.emailAddress));
            const userWoman = await this.WomanDayService.findWomanUser(userWomenTest)
          for (const user of userWoman) {
            const Embed = new EmbedBuilder()
              .setTitle("Happy Women's Day 💋")
              .setDescription(
                'Sắp đến mùng 8 tháng 3 \n Giá hoa thì đắt giá quà thì cao' +
                  '\n' +
                  'Tiền lương tiêu hết hồi nào' +
                  '\n' +
                  'Bonus thì lại chẳng trao dịp này' +
                  '\n' +
                  'Thôi thì có tấm thân gầy' +
                  '\n' +
                  'Nguyện trao gửi phận đến tay ai cần' +
                  '\n' +
                  'Cùng những lời chúc có vần' +
                  '\n' +
                  'Một trái tim nhỏ, ngàn lần yêu thương' +
                  '\n' +
                  'Chúc cho may mắn đủ đường' +
                  '\n' +
                  'Chị em đến tháng......lĩnh lương nhiều nhiều' +
                  '\n' +
                  'Ung dung chẳng nghĩ tiền tiêu' +
                  '\n' +
                  'Công việc thuận lợi mọi điều hanh thông' +
                  '\n' +
                  'Đến tuổi chúc sớm lấy chồng' +
                  '\n' +
                  'Gia đình hạnh phúc thành công mọi đường' +
                  '\n' +
                  'Chị em chưa có người thương' +
                  '\n' +
                  'Sớm có thằng rước thuận đường tình duyên' +
                  '\n' +
                  'Anh em phải nhớ không quên' +
                  '\n' +
                  'Chị em mãi đẹp nữ quyền lên ngôi.' +
                  '\n' +
                  '*From NCC8 with Love*'
              )
              .setColor(0xed4245)
              .setFooter({
                text: 'Nhiều 🎁 hấp dẫn bên dưới đang chờ đón chị em',
              })
              .setImage(
                'https://media.discordapp.net/attachments/921593472039915551/950241681041670164/unknown.png'
              );
            const row = new ActionRowBuilder();
            for (let i = 0; i < 5; i++) {
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`8/3_&userid=${user.userId}&key=${i}`)
                  .setLabel('🎁')
                  .setStyle(1)
              );
            }
    
            await this.komubotrestController.sendMessageKomuToUser(
              client,
              { embeds: [Embed], components: [row] },
              user.email
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
}