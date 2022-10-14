import { date } from "@hapi/joi";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import console from "console";
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
import { Leave } from "src/bot/models/leave.entity";
import { Meeting } from "src/bot/models/meeting.entity";
import { Mentioned } from "src/bot/models/mentioned.entity";
import { Order } from "src/bot/models/order.entity";
import { Penalty } from "src/bot/models/penatly.entity";
import { Quiz } from "src/bot/models/quiz.entity";
import { Remind } from "src/bot/models/remind.entity";
import { CheckCamera } from "src/bot/models/checkCamera.entity";
import { CheckList } from "src/bot/models/checklist.entity";
import { CompanyTrip } from "src/bot/models/companyTrip.entity";
import { Conversation } from "src/bot/models/conversation.entity";
import { Dating } from "src/bot/models/dating.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Wiki } from "src/bot/models/wiki.entity";
import { WomenDay } from "src/bot/models/womenDay.entity";
import { Workout } from "src/bot/models/workout.entity";
import { Repository } from "typeorm";
import { Keep } from "src/bot/models/keep.entity";
import { JoinCall } from "src/bot/models/joinCall.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { GuildData } from "src/bot/models/guildData.entity";
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
    private workFromHomeRepository: Repository<WorkFromHome>,
    @InjectRepository(Remind) private remindRepository: Repository<Remind>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Penalty) private penaltyRepository: Repository<Penalty>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Mentioned)
    private mentionedRepository: Repository<Mentioned>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    @InjectRepository(Keep)
    private keepRepository: Repository<Keep>,
    @InjectRepository(JoinCall)
    private joinCallRepository: Repository<JoinCall>,
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
    @InjectRepository(GuildData)
    private guildReposistory: Repository<GuildData>,
    @InjectRepository(Dating)
    private datingReposistory: Repository<Dating>,
    @InjectRepository(Conversation)
    private conversationReposistory: Repository<Conversation>,
    @InjectRepository(CompanyTrip)
    private companytripReposistory: Repository<CompanyTrip>,
    @InjectRepository(CheckList)
    private checkListReposistory: Repository<CheckList>,
    @InjectRepository(CheckCamera)
    private checkCameraReposistory: Repository<CheckCamera>,
    @InjectRepository(BwlReaction)
    private bwlReactionReposistory: Repository<BwlReaction>,
    @InjectRepository(Channel)
    private channelReposistory: Repository<Channel>,
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
  }

  async saveBirthday(item) {
    await this.birthDayRepository.insert({
      title: item.title,
    });
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
  }

  async saveOpentalk(item) {
    await this.opentalkRepository.insert({
      userId: item.userId,
      username: item.username,
      createdTimestamp: +item.date,
    });
  }

  async saveWiki(item) {
    await this.wikiRepository.insert({
      name: item.name,
      value: item.value,
      creator: item.creator,
      type: item.type,
    });
  }

  async saveWomenday(item) {
    await this.womenDayRepository.insert({
      userId: item.userid,
      win: item.win,
      gift: item.gift,
    });
  }

  async saveUploadFile(item) {
    await this.uploadfileRepository.insert({
      filePath: item.filePath,
      fileName: item.fileName,
      episode: item.episode,
      createTimestamp: +item.createTimestamp,
    });
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
  }

  async saveTrackerSpent(item) {
    await this.trackerSpentTimeRepository.insert({
      email: item.email,
      spent_time: item.spent_time,
      date: item.date,
      call_time: item.call_time,
      wfh: item.wfh,
    });
  }

  async saveTimevoicealones(item) {
    await this.timeVoiceAloneRepository.insert({
      channelId: item.channelId,
      status: item.status,
      start_time: +item.start_time,
    });
  }

  async saveSubcategory(item) {
    await this.subcategorysRepository.insert({
      title: item.title,
    });
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
    }).catch((err) => {
      return;
    });
  }

  async saveWfh(item) {
    const timestamp = new Date(item.createdAt);
    const authorInsert = await this.userRepository.findOne({
      where: {
        userId: item.userid,
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
  }

  async saveRemind(item) {
    await this.remindRepository.insert({
      channelId: item.channelId,
      mentionUserId: item.mentionUserId,
      authorId: item.authorId,
      content: item.content,
      cancel: item.cancel,
      createdTimestamp: +item.createdTimestamp,
    });
  }

  async saveQuiz(item) {
    await this.quizRepository.insert({
      title: item.title,
      options: item.options,
      correct: item.correct,
      role: item.role,
      isVerify: item.isVerify,
      accept: item.accept,
      author_email: item.author_email,
      topic: item.topic,
    });
  }

  async savePenatly(item) {
    await this.penaltyRepository.insert({
      userId: item.user_id,
      username: item.username,
      ammount: item.ammount,
      reason: item.reason,
      createdTimestamp: +item.createdTimestamp,
      isReject: item.is_reject,
      channelId: item.channel_id,
      delete: item.delete,
    });
  }

  async saveOrder(item) {
    await this.orderRepository.insert({
      userId: item.userId,
      username: item.username,
      createdTimestamp: +item.createdTimestamp,
      channelId: item.channelId,
      menu: item.menu,
      isCancel: item.isCancel,
    });
  }

  async saveMsg(item, index) {
    const channelInsert = await this.channelRepository.findOne({
      where: {
        id: item.channel_id,
      },
    });
    const authorInsert = await this.userRepository.findOne({
      where: { userId: item.author_Id },
    });

    const tx8Insert = await this.tx8Repository.findOne({
      where: { id: item.tx8 },
    });

    await this.msgRepository.insert({
      guildId: item.guild_id,
      deleted: item.deleted,
      author: authorInsert,
      channel: channelInsert,
      tx8: tx8Insert as any,
      createdTimestamp: +item.createdTimestamp,
      type: item.type,
      system: item.system,
      content: item.content,
      pinned: item.pinned,
      tts: item.tts,
      nonce: item.nonce,
      embeds: item.embeds,
      components: item.components,
      attachments: item.attachments,
      stickers: item.stickers,
      editedTimestamp: item.editedTimestamp,
      reactions: item.reactions,
      mentions: item.mentions,
      webhookId: item.webhookId,
      groupActivityApplication: item.groupActivityApplication,
      applicationId: item.applicationId,
      activity: item.activity,
      flags: item.flags,
      reference: item.reference,
      interaction: item.interaction,
    });
  }

  async saveMention(item) {
    await this.mentionedRepository.insert({
      messageId: item.messageId,
      authorId: item.authorId,
      channelId: item.channelId,
      mentionUserId: item.mentionUserId,
      createdTimestamp: +item.createdTimestamp,
      noti: item.noti,
      confirm: item.confirm,
      punish: item.punish,
      reactionTimestamp: +item.reactionTimestamp,
    });
  }

  async saveMeeting(item) {
    await this.meetingRepository.insert({
      channelId: item.channelId,
      createdTimestamp: +item.createdTimestamp,
      task: item.task,
      repeat: item.repeat,
      cancel: item.cancel,
      reminder: item.reminder,
      repeatTime: item.repeatTime,
    });
  }

  async saveLeave(item) {
    const timestamp = new Date(item.createdAt);
    await this.leaveRepository.insert({
      channelId: item.channelId,
      userId: item.userId,
      reason: item.reason,
      minute: item.minute,
      createdAt: timestamp.getTime(),
    });
  }

  async saveKeep(item) {
    const timestamp = new Date(item.createdAt);
    await this.keepRepository.insert({
      userId: item.userid,
      note: item.note,
      status: item.status,
      start_time: timestamp.getTime(),
    });
  }

  async saveJoinCall(item) {
    await this.joinCallRepository.insert({
      userId: item.userid,
      channelId: item.channelId,
      status: item.status,
      start_time: +item.start_time,
      end_time: +item.end_time,
    });
  }

  async saveHoliday(item) {
    await this.holidayRepository.insert({
      dateTime: item.dateTime,
      content: item.content,
    });
  }
  async saveGuildData(item) {
    await this.guildReposistory.insert({
      serverID: item.serverID,
      prefix: item.prefix,
      lang: item.lang,
      premium: item.premium,
      premiumUserID: item.premiumUserID,
      chatbot: item.chatbot,
      ignored_channel: item.ignored_channel,
      admin_role: item.admin_role,
      goodPremium: item.goodPremium,
      requestChannel: item.requestChannel,
      requestMessage: item.requestMessage,
      defaultVolume: item.defaultVolume,
      vc: item.vc,
      clearing: item.clearing,
      auto_shuffle: item.auto_shuffle,
      games_enabled: item.games_enabled,
      util_enabled: item.util_enabled,
      autorole: item.autorole,
      autorole_bot: item.autorole_bot,
      dj_role: item.dj_role,
      count: item.count,
      autopost: item.autopost,
      suggestions: item.suggestions,
      color: item.color,
      backlist: item.backlist,
      autonick: item.autonick,
      autonick_bot: item.autonick_bot,
      autoplay: item.autoplay,
      song: item.song,
      h24: item.h24,
      announce: item.announce,
      plugins: item.plugins,
      protections: item.protections,
    });
  }
  async saveDating(item) {
    await this.datingReposistory.insert({
      channelId: item.channelId,
      userId: item.userId,
      email: item.email,
      sex: item.sex,
      loop: item.loop,
      createdTimestamp: +item.createdTimestamp,
    });
  }
  async saveConversation(item) {
    await this.conversationReposistory.insert({
      channelId: item.channelId,
      authorId: item.authorId,
      generated_responses: item.generated_responses,
      past_user_inputs: item.past_user_inputs,
      createdTimestamp: +item.createdTimestamp,
      updatedTimestamp: +item.updatedTimestamp,
    });
  }
  async companytrip(item) {
    await this.companytripReposistory.insert({
      year: item.year,
      fullName: item.fullName,
      userId: item.userId,
      email: item.email,
      phone: item.phone,
      office: item.office,
      role: item.role,
      kingOfRoom: item.kingOfRoom,
      room: item.room,
    });
  }
  async checklist(item) {
    await this.checkListReposistory.insert({
      subcategory: item.subcategory,
      category: item.category,
    });
  }
  async checkcamera(item) {
    await this.checkCameraReposistory.insert({
      userId: item.userId,
      channelId: item.channelId,
      enableCamera: item.enableCamera,
      createdTimestamp: +item.createdTimestamp,
    });
  }
  async bwlReaction(item) {
    const channelInsert = await this.channelRepository.findOne({
      where: {
        id: item.channelId,
      },
    });
    const bwlInsert = await this.bwlRepository.findOne({
      where: {
        messageId: item.messageId,
      },
    });
    const authorInsert = await this.userRepository.findOne({
      where: {
        userId: item.authorId,
      },
    });
    await this.bwlReactionReposistory
      .insert({
        guildId: item.guildId,
        emoji: item.emoji,
        count: item.count,
        createdTimestamp: +item.createdTimestamp,
        bwl: bwlInsert,
        channel: channelInsert,
        author: authorInsert,
      })
      .catch((err) => {
        return;
      });
  }
  async channel(item) {
    await this.channelReposistory
      .insert({
        name: item.name,
        type: item.type,
        nsfw: item.nsfw,
        rawPosition: item.rawPosition,
        lastMessageId: item.lastMessageId,
        rateLimitPerUser: item.rateLimitPerUser,
        parentId: item.parentId,
        id: item.id,
      })
      .catch((err) => {
        return;
      });
  }
}
