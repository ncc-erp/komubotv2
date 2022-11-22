import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Repository } from "typeorm";
import { KomubotrestService } from "../komubotrest/komubotrest.service";

@Injectable()
@Injectable()
export class WfhService {
  constructor(
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private komubotrestService: KomubotrestService,
    private readonly http: HttpService,
    private readonly clientConfigService: ClientConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async wfh(interaction, client) {
    const arrIds = interaction.customId.split("#");
    const customId = arrIds[0];
    const labelImageId = arrIds.length > 1 ? arrIds[1] : "";
    let isCheckin = true;
    let msg = "";

    if (
      arrIds.length > 2 &&
      ((labelImageId == interaction.user.id && arrIds[0] == "komu_wfh_complain" && arrIds.length === 3) || (arrIds[0] == "komu_wfh_complain" && arrIds.length > 3) || arrIds[0] == "komu_wfh_accept")
    ) {
      console.log("wfh complain from", interaction.user.id);

      const wfhid = arrIds[2];
      if (
        arrIds[0] == "komu_wfh_accept" ||
        arrIds[0] == "komu_wfh_accept_but"
      ) {
        await this.wfhRepository
          .createQueryBuilder()
          .update(WorkFromHome)
          .set({
            pmconfirm: false,
            data: arrIds[0],
            status: "ACCEPT",
          })
          .where(`"userId" = :userId`, { userId: labelImageId })
          .execute();

        interaction
          .reply({ content: "Thanks!!!", ephemeral: true, fetchReply: true })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(
              client,
              interaction.user.id,
              err
            );
          });
        return;
      }
      if (arrIds.length == 3) {
        const wfhdata = await this.wfhRepository
          .createQueryBuilder()
          .where(`"id" = :id`, { id: wfhid })
          .select("*")
          .execute();
        if (!wfhdata) {
          interaction
            .reply({
              content: "No WFH found",
              ephemeral: true,
              fetchReply: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                client,
                interaction.user.id,
                err
              );
            });
          return;
        }
        const msec = (new Date() as any) - (new Date(wfhdata.createdAt) as any);
        if (msec > 3600000) {
          interaction
            .reply({
              content: "WFH complain is expired. You have an hour to request.",
              ephemeral: true,
              fetchReply: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                client,
                interaction.user.id,
                err
              );
            });
          return;
        }

        if (wfhdata.complain) {
          interaction
            .reply({
              content: "You have already complained.",
              ephemeral: true,
              fetchReply: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                client,
                interaction.user.id,
                err
              );
            });
          return;
        }

        // send message to PM
        const userdb = await this.userRepository
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId: labelImageId })
          .andWhere('"deactive" IS NOT True')
          .select("*")
          .getRawOne();
        if (!userdb) {
          return interaction
            .reply({
              content: "`User is not valid`",
              ephemeral: true,
              fetchReply: true,
            })
            .catch(console.error);
        }
        const url = encodeURI(
          `${this.clientConfigService.wiki.api_url}${userdb.email}@ncc.asia`
        );
        const response = await firstValueFrom(
          this.http
            .get(url, {
              headers: {
                "X-Secret-Key": this.clientConfigService.wikiApiKeySecret,
              },
            })
            .pipe((res) => res)
        ).catch(() => {
          interaction
            .reply({
              content: `Error while looking up for **${userdb.email}**.`,
              ephemeral: true,
              fetchReply: true,
            })
            .catch(console.error);
          return { data: "There was an error!" };
        });
        if (
          response.data == null ||
          response.data == undefined ||
          response.data.result == null ||
          response.data.result == undefined ||
          response.data.result.projectDtos == undefined ||
          response.data.result.projectDtos.length == 0
        ) {
          msg = `There is no PM to confirm for **${userdb.email}**. Please contact to your PM`;
          return interaction
            .reply({ content: msg, ephemeral: true, fetchReply: true })
            .catch(console.error);
        }

        const pmdb = await this.userRepository
          .createQueryBuilder()
          .where(`"username" = :username`, {
            username: response.data.result.projectDtos[0].pmUsername,
          })
          .orWhere(`"email" = :email`, {
            email: response.data.result.projectDtos[0].pmUsername,
          })
          .andWhere(`"deactive" IS NOT true`)
          .select("*")
          .getRawOne();

        if (!pmdb) {
          interaction
            .reply({
              content: `Cannot fetch data for PM ${response.data.result.projectDtos[0].pmUsername}`,
              ephemeral: true,
              fetchReply: true,
            })
            .catch(console.error);
          return;
        }
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(
              "komu_wfh_complain#" +
                labelImageId +
                "#" +
                wfhid +
                "#reject#" +
                pmdb.userId
            )
            .setLabel("Reject")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(
              "komu_wfh_complain#" +
                labelImageId +
                "#" +
                wfhid +
                "#confirm#" +
                pmdb.userId
            )
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Primary)
        );
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("Verify WFH Complain")
          .setDescription(
            `<@${labelImageId}> just sent WFH complain. Please check?`
          );
        const user = await client.users.fetch(pmdb.userId).catch(console.error);
        if (!user) {
          interaction
            .reply({
              content: `Cannot fetch username: ${pmdb.username}, with id: ${pmdb.userId}`,
              ephemeral: true,
              fetchReply: true,
            })
            .catch(console.error);
          return;
        }
        await user
          .send({ embeds: [embed], components: [row] })
          .catch(console.error);

        await this.wfhRepository
          .createQueryBuilder()
          .update(WorkFromHome)
          .set({
            complain: true,
          })
          .where(`"id" = :id`, {
            id: wfhid,
          });
        await interaction
          .reply({
            content: `<@${labelImageId}> your WFH complain is sent to <@${pmdb.userId}>.`,
            ephemeral: true,
            fetchReply: true,
          })
          .catch(console.error);
      } else if (arrIds.length >= 3) {
        // If PM approved, send message to channel
        if (
          arrIds.length > 2 &&
          (arrIds[3] == "confirm" || arrIds[3] == "reject")
        ) {
          if (arrIds.length > 3) {
            const pmid = arrIds[4];
            const message = `<@${pmid}> just ${arrIds[3]}ed WFH complain from <@${labelImageId}>`;
            await this.wfhRepository
              .createQueryBuilder()
              .update(WorkFromHome)
              .set({
                pmconfirm: arrIds[3] == "confirm",
                data: message,
                status: "APPROVED",
              })
              .where(`"id" = :id`, {
                id: wfhid,
              });
            await client.channels.cache
              .get(this.clientConfigService.machleoChannelId)
              .send(message)
              .catch(console.error);
            await interaction
              .reply({
                content: `You just ${arrIds[3]}ed WFH complain for <@${labelImageId}>`,
                ephemeral: true,
                fetchReply: true,
              })
              .catch(console.error);
          }
        }
      }
      return;
    }
    if (customId == "komu_checkin_yes" || customId == "komu_checkin_no") {
      msg = "👍 Have a good day!!!";
      if (customId == "komu_checkin_no") {
        msg = "👎 Let me check!";
      }
    } else if (customId == "komu_wfh_lbl1" || customId == "komu_wfh_lbl2") {
      msg = "👍 Let's rock!!!";
      if (customId == "komu_wfh_lbl2") {
        msg = "`👎 Thanks!`";
      }
      isCheckin = false;
    } else {
      interaction
        .reply({
          content: "You are not the right people to complain:)",
          ephemeral: true,
          fetchReply: true,
        })
        .catch(console.error);
      return;
    }
    try {
      const verifiedImageId = labelImageId;
      const imageLabelId = labelImageId;
      const answerFaceConfirm = interaction.user.username;
      const answerValue = customId;
      await firstValueFrom(
        this.http
          .put(
            `${process.env.KOMUBOTREST_CHECK_IN_URL}v1/employees/image-label/update-image-label`,
            {
              verifiedImageId: verifiedImageId,
              imageLabelId: imageLabelId,
              answerFaceConfirm: answerFaceConfirm,
              answerValue: answerValue,
              isCheckin: isCheckin,
            },
            {
              headers: {
                "X-Secret-Key": this.clientConfigService.komubotRestSecretKey,
              },
            }
          )
          .pipe((res) => res)
      ).catch((error) => {
        console.log(error);
        interaction.reply("Error: " + error).catch(console.error);
      });
      console.log("Update update message WFH successfully!");
      // end process wfh command
      interaction
        .reply({ content: msg, ephemeral: false, fetchReply: true })
        .catch(console.error);
    } catch (error) {
      console.log("Update update message WFH! - ERROR: " + error);
      interaction.reply("Error! " + error).catch(console.error);
    }
  }
}
