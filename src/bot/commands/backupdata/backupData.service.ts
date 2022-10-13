import { date } from "@hapi/joi";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { BirthDay } from "src/bot/models/birthday.entity";
import { Bwl } from "src/bot/models/bwl.entity";
import { BwlReaction } from "src/bot/models/bwlReact.entity";
import { Channel } from "src/bot/models/channel.entity";
import { Daily } from "src/bot/models/daily.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Opentalk } from "src/bot/models/opentalk.entity";
import { Subcategorys } from "src/bot/models/subcategoryData.entity";
import { TimeVoiceAlone } from "src/bot/models/timeVoiceAlone.entity";
import { TrackerSpentTime } from "src/bot/models/trackerSpentTime.entity";
import { TX8 } from "src/bot/models/tx8.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Wiki } from "src/bot/models/wiki.entity";
import { WomenDay } from "src/bot/models/womenDay.entity";
import { Workout } from "src/bot/models/workout.entity";
import { Repository } from "typeorm";
@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Daily) private dailyRepository: Repository<Daily>,
    @InjectRepository(VoiceChannels)
    private voiceChannelRepository: Repository<VoiceChannels>,
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
    @InjectRepository(Opentalk)
    private opentalkRepository: Repository<Opentalk>,
    @InjectRepository(Wiki)
    private wikiRepository: Repository<Wiki>,
    @InjectRepository(WomenDay)
    private womenDayRepository: Repository<WomenDay>,
    @InjectRepository(Uploadfile)
    private uploadfileRepository: Repository<Uploadfile>,
    @InjectRepository(TX8)
    private tx8Repository: Repository<TX8>,
    @InjectRepository(TrackerSpentTime)
    private trackerSpentTimeRepository: Repository<TrackerSpentTime>,
    @InjectRepository(TimeVoiceAlone)
    private timeVoiceAloneRepository: Repository<TimeVoiceAlone>,
    @InjectRepository(Subcategorys)
    private subcategorysRepository: Repository<Subcategorys>,
    @InjectRepository(Bwl)
    private bwlRepository: Repository<Bwl>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BwlReaction)
    private bwlReactionRepository: Repository<BwlReaction>,
    @InjectRepository(BirthDay)
    private birthDayRepository: Repository<BirthDay>,
    @InjectRepository(Msg)
    private msgRepository: Repository<Msg>,
    @InjectRepository(WorkFromHome)
    private workFromHomeRepository: Repository<WorkFromHome>
  ) {}

  async saveVoiechannel(item) {
    await this.voiceChannelRepository.insert({
      voiceChannelId: item.id,
      originalName: item.originalName,
      newRoomName: item.newRoomName,
      people: item.people,
      status: item.status,
      createdTimestamp: +item.createdTimestamp,
    });
    console.log("done");
  }

  async saveBirthday(item) {
    await this.birthDayRepository.insert({
      title: item.title,
    });
    console.log("done");
  }

  async saveDaily(item) {
    const timestamp = new Date(item.createdAt);
    await this.dailyRepository.insert({
      userid: item.userid,
      email: item.email,
      daily: item.daily,
      createdAt: timestamp.getTime(),
      channelid: item.channelid,
    });
    console.log("done");
  }

  async saveWorkout(item) {
    const timestamp = new Date(item.createdTimestamp);
    await this.workoutRepository.insert({
      userId: item.userId,
      email: item.email,
      attachment: item.attachment,
      status: item.status,
      channelId: item.channelId,
      createdTimestamp: timestamp.getTime(),
    });
    console.log("done");
  }

  async saveOpentalk(item) {
    await this.opentalkRepository.insert({
      userId: item.userId,
      username: item.username,
      createdTimestamp: +item.date,
    });
    console.log("done");
  }

  async saveWiki(item) {
    await this.wikiRepository.insert({
      name: item.name,
      value: item.value,
      creator: item.creator,
      type: item.type,
    });
    console.log("done");
  }

  async saveWomenday(item) {
    await this.womenDayRepository.insert({
      userId: item.userid,
      win: item.win,
      gift: item.gift,
    });
    console.log("done");
  }

  async saveUploadFile(item) {
    await this.uploadfileRepository.insert({
      filePath: item.filePath,
      fileName: item.fileName,
      episode: item.episode,
      createTimestamp: +item.createTimestamp,
    });
    console.log("done");
  }

  async saveTx8(item) {
    const msgInsert = await this.msgRepository.findOne({
      where: {
        id: item.messageId,
      },
    });
    const authorInsert = await this.userRepository.findOne({
      where: {
        userId: item.userId,
      },
    });
    await this.tx8Repository.insert({
      message: msgInsert,
      user: authorInsert,
      tx8number: item.tx8number,
      status: item.status,
      createdTimestamp: +item.createdTimestamp,
    });
    console.log("done");
  }

  async saveTrackerSpent(item) {
    await this.trackerSpentTimeRepository.insert({
      email: item.email,
      spent_time: item.spent_time,
      date: item.date,
      call_time: item.call_time,
      wfh: item.wfh,
    });
    console.log("done");
  }

  async saveTimevoicealones(item) {
    await this.timeVoiceAloneRepository.insert({
      channelId: item.channelId,
      status: item.status,
      start_time: +item.start_time,
    });
    console.log("done");
  }

  async saveSubcategory(item) {
    await this.subcategorysRepository.insert({
      title: item.title,
    });
    console.log("done");
  }

  async saveBwls(item) {
    const channelInsert = await this.channelRepository.findOne({
      where: {
        id: item.channelId,
      },
    });
    const authorInsert = await this.userRepository.findOne({
      where: {
        userId: item.authorId,
      },
    });
    await this.bwlRepository.insert({
      messageId: item.messageId,
      guildId: item.guildId,
      link: item.link,
      createdTimestamp: +item.createdTimestamp,
      channel: channelInsert,
      author: authorInsert,
    });
    console.log("done");
  }

  async saveWfh(item) {
    const timestamp = new Date(item.createdAt);
    const authorInsert = await this.userRepository.findOne({
      where: {
        userId: item.authorId,
      },
    });
    await this.workFromHomeRepository.insert({
      user: authorInsert,
      wfhMsg: item.wfhMsg,
      createdAt: timestamp.getTime(),
      complain: item.complain,
      pmconfirm: item.pmconfirm,
      status: item.status,
      data: item.data,
      type: item.type,
    });
    console.log("done");
  }

  async saveUser(item) {
    await this.userRepository.insert({
      userId: item.id,
      username: item.username,
      discriminator: item.discriminator,
      avatar: item.avatar,
      bot: item.bot,
      system: item.system,
      mfa_enabled: item.mfa_enabled,
      banner: item.banner,
      accent_color: item.accent_color,
      locale: item.locale,
      verified: item.verified,
      email: item.email,
      flags: item.flags,
      premium_type: item.premium_type,
      public_flags: item.public_flags,
      last_message_id: item.last_message_id,
      last_mentioned_message_id: item.last_mentioned_message_id,
      scores_quiz: item.scores_quiz,
      roles: item.roles,
      pending_wfh: item.pending_wfh,
      last_bot_message_id: item.last_bot_message_id,
      deactive: item.deactive,
      roles_discord: item.roles_discord,
      botPing: item.botPing,
    });
    console.log("done");
  }
}
