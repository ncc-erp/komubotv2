import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class MachleoDto {
  @Transform(({ value }) => value.toUpperCase())
  @Param({
    name: "message",
    description: "mách gì nè",
    required: true,
  })
  message: string;
}
