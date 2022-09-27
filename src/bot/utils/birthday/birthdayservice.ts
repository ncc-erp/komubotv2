import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { BirthDay } from "src/bot/models/birthday.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class BirthdayService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    @InjectRepository(BirthDay)
    private birthdayReposistory: Repository<BirthDay>,
    private clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  async getBirthdayUser(email, client) {
    try {
      const { data } = await firstValueFrom(
        this.http
          .get(`${this.clientConfigService.wiki.api_url}${email}@ncc.asia`, {
            headers: {
              "X-Secret-Key": process.env.WIKI_API_KEY_SECRET,
            },
          })
          .pipe((res) => res)
      ).catch((err) => {
        console.log("Error ", err);
        return { data: "There was an error!" };
      });
      if (!data || !data.result) return;
      const dobUser = {
        birthday: data.result.dob,
        name: data.result.employeeName,
        email: data.result.emailAddress.slice(0, -9),
      };
      const today = new Date();
      const currentDate = today.toISOString().substring(5, 10);
      if (dobUser.birthday !== null) {
        if (dobUser.birthday.substring(5, 10) === currentDate) {
          return dobUser.email;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async birthdayUser(client) {
    const result = [];
    const getAllUser = await this.userReposistory
      .createQueryBuilder("users")
      .where('"deactive" IS NOT True')
      .select("users.*")
      .execute();

    const emailArray = getAllUser.map((item) => item.email);
    const resultBirthday = await this.birthdayReposistory.find();
    const items = resultBirthday.map((item) => item.title);
    let wishes = items;
    for (const email of emailArray) {
      const emailBirthday = await this.getBirthdayUser(
        encodeURI(email),
        client
      );
      if (!emailBirthday) continue;
      if (!wishes.length) wishes = items;
      const index = Math.floor(Math.random() * items.length);
      const birthdayWish = wishes[index];
      wishes.splice(index, 1);
      const birthday = await this.userReposistory
        .createQueryBuilder("users")
        .where('"email" = :email AND "deactive" IS NOT True', {
          email: emailBirthday,
        })
        .select("users.*")
        .execute();
      result.push({ user: birthday, wish: birthdayWish });
    }
    return result;
  }
}
