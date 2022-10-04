import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { BWLService } from "./bwl.service";


@CommandLine({
    name: 'bwl',
    description: 'BWL leaderboard',
    cat : "komu"
})
export  class BWLCommand implements CommandLineClass{
    constructor(
      private bwlService : BWLService,
    ) {
      
    }
     getTimeWeek(time) {
        let curr;
        if (time) {
          if (!this.validateTimeDDMMYYYY(time)) {
            return;
          }
          const timeFormat = this.formatDayMonth(time);
          curr = new Date(timeFormat);
        } else {
          curr = new Date();
        }
        // current date of week
        const currentWeekDay = curr.getDay();
        const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
        const firstweek = new Date(new Date(curr).setDate(curr.getDate() - lessDays));
        const lastweek = new Date(
          new Date(firstweek).setDate(firstweek.getDate() + 7)
        );
      
        return {
          firstday: {
            timestamp: new Date(this.withoutTime(firstweek)).getTime(),
            date: this.formatDate(new Date(this.withoutTime(firstweek))),
          },
          lastday: {
            timestamp: new Date(this.withoutTime(lastweek)).getTime(),
            date: this.formatDate(new Date(this.withoutTime(lastweek))),
          },
        };
      }
      
       withoutTime(dateTime) {
        const date = new Date(dateTime);
        date.setHours(0, 0, 0, 0);
        return date;
      }
       formatDayMonth(time) {
        const day = time.split('').slice(0, 2).join('');
        const month = time.split('').slice(3, 5).join('');
        const year = time.split('').slice(6, 10).join('');
        return `${month}/${day}/${year}`;
      }
      
       formatDate(time) {
        const today = new Date(time);
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      }
      
       validateTimeDDMMYYYY(time) {
        return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(
          time
        );
      }
      
      async execute(message, args) {
        try {
          if (args[0] === 'help') {
            return message.channel.send(
              '```' +
                '*bwl channel_id top dd/mm/yyyy' +
                '\n' +
                'channel_id : right click to the channel & copy' +
                '```'
            );
          }
    
          const channelId = args[0] || message.channel.id;
    
          const top =
            (!isNaN(parseFloat(args[1])) &&
              !isNaN(args[1] - 0) &&
              parseInt(args[1])) ||
            5;
          const time = args[2];
          if (!channelId || !this.getTimeWeek(time)) {
            return message.channel.send('```invalid channel or time```');
          }
        const bwlData =   await this.bwlService.findBwlReactData(channelId, this.getTimeWeek(time).firstday.timestamp,this.getTimeWeek(time).lastday.timestamp )
          console.log('bwlData : ', bwlData);
          // bwlReactData
          //   .aggregate(aggregatorOpts)
          //   .exec()
          //   .then((docs) => {
          //     let name = [];
          //     if (docs.length) {
          //       name = docs.map((doc, index) => {
          //         return `Top ${index + 1} ${doc.author.username}: ${
          //           doc.totalReact
          //         } votes`;
          //       });
          //     }
          //     if (Array.isArray(name) && name.length === 0) {
          //       message.channel.send('```no result```');
          //     } else {
          //       message.channel
          //         .send(
          //           '```' +
          //             this.getTimeWeek(time).firstday.date +
          //             ' - ' +
          //             this.getTimeWeek(time).lastday.date +
          //             '\n' +
          //             name.join('\n') +
          //             '```'
          //         )
          //         .catch(console.error);
          //     }
          //   });
        } catch (e) {
          console.log(e);
        }
      }
}