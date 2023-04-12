import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class WikiDto {
  @Param({
    name: "topic",
    description: "topic is link|office|project|hr|tx8... or @user",
    required: true,
  })
  topic: string;
}
