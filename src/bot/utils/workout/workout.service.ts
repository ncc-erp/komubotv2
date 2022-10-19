import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Workout } from "src/bot/models/workout.entity";
import { Repository } from "typeorm";
import { KomubotrestService } from "../komubotrest/komubotrest.service";

@Injectable()
@Injectable()
export class WorkoutService {
  constructor(
    private komubotrestService: KomubotrestService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>
  ) {}
  async workout(interaction, client) {
    const arrIds = interaction.customId.split("#");
    const labelImageId = arrIds.length > 1 ? arrIds[4] : "";
    const labelImageEmail = arrIds.length > 1 ? arrIds[1] : "";
    const workourid = arrIds[2];

    const authorId = interaction.message.author.id;
    const checkRole = await this.userRepository
      .createQueryBuilder("user")
      .where('"userId" = :userId', { userId: interaction.user.id })
      .andWhere('"deactive" IS NOT True')
      .andWhere('("roles_discord" @> :hr)', {
        hr: ["HR"],
      })
      .select("*")
      .execute();
    if (
      checkRole.length > 0 ||
      interaction.user.id === "921261168088190997" ||
      interaction.user.id === "868040521136873503"
    ) {
      if (
        arrIds.length > 2 &&
        arrIds[0] == "workout_reject" &&
        // labelImageId == interaction.user.id &&
        authorId == client.user.id
      ) {
        const workoutDb = await this.workoutRepository
          .findOne({ where: { id: workourid } })
          .catch(console.error);
        if (!workoutDb) {
          interaction
            .reply({
              content: "No workout found",
              ephemeral: true,
              fetchReply: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          return;
        }

        if (workoutDb.status === "reject") {
          interaction
            .reply({
              content: "You have already rejected.",
              ephemeral: true,
              fetchReply: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          return;
        }
        const userdb = await this.userRepository
          .findOne({ where: { userId: labelImageId } })
          .catch(console.error);
        if (!userdb) {
          return interaction
            .reply({
              content: "`User is not valid`",
              ephemeral: true,
              fetchReply: true,
            })
            .catch(console.error);
        }
        const message = `${interaction.user.username} just rejected workout from ${labelImageEmail}`;

        await client.channels.cache
          .get(arrIds[3])
          .send(message)
          .catch(console.error);
        await this.workoutRepository
          .createQueryBuilder()
          .update(Workout)
          .set({
            status: "reject",
          })
          .where(`"id" = :id`, { id: workourid })
          .execute()
          .catch(console.error);
        return;
      }
    } else {
      interaction
        .reply({
          content: "You do not have permission to execute this workout",
          ephemeral: true,
          fetchReply: true,
        })
        .catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      return;
    }
  }
}
