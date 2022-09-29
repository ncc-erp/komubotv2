import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class VocabDto {
  @Transform(({ value }) => value.toUpperCase())
  @Param({
    name: "word",
    description: "word for search",
    required: true,
  })
  topic: string;
}
