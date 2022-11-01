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
    private userRepository: Repository<User>,
    @InjectRepository(BirthDay)
    private birthdayRepository: Repository<BirthDay>,
    private clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  // async getBirthdayUser(email, client) {
  //   try {
  //     const { data } = await firstValueFrom(
  //       this.http
  //         .get(`${this.clientConfigService.wiki.api_url}${email}@ncc.asia`, {
  //           headers: {
  //             "X-Secret-Key": this.clientConfigService.wfhApiKey,
  //           },
  //         })
  //         .pipe((res) => res)
  //     ).catch((err) => {
  //       console.log("Error ", err);
  //       return { data: "There was an error!" };
  //     });
  //     if (!data || !data.result) return;
  //     const dobUser = {
  //       birthday: data.result.dob,
  //       name: data.result.employeeName,
  //       email: data.result.emailAddress.slice(0, -9),
  //     };
  //     const today = new Date();
  //     const currentDate = today.toISOString().substring(5, 10);
  //     if (dobUser.birthday !== null) {
  //       if (dobUser.birthday.substring(5, 10) === currentDate) {
  //         return dobUser.email;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async birthdayUser() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const { data } = await firstValueFrom(
      this.http
        .get(
          `${this.clientConfigService.birthday.api_url}?month=${month}&day=${day}`,
          {
            headers: {
              "X-Secret-Key": this.clientConfigService.wfhApiKey,
            },
          }
        )
        .pipe((res) => res)
    );
    const result = [];

    await Promise.all(
      data.result.map(async (item) => {
        const birthday = await this.userRepository
          .createQueryBuilder("users")
          .where('"email" = :email', {
            email: item.email.slice(0, -9),
          })
          .andWhere('"deactive" IS NOT True')
          .select("users.*")
          .execute();
        const resultBirthday = await this.birthdayRepository.find();
        const items = resultBirthday.map((item) => item.title);
        let wishes = items;
        if (!wishes.length) wishes = items;
        const index = Math.floor(Math.random() * items.length);
        const birthdayWish = wishes[index];
        wishes.splice(index, 1);
        result.push({ user: birthday, wish: birthdayWish });
      })
    );
    return result;
  }
}
