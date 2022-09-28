import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class KeepDto {
  @Transform(({ value }) => value.toUpperCase())
  @Param({
    name: "note",
    description: "what ever you want to keep",
    required: true,
  })
  note: string;
}
