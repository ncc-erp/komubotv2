import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class VocabDto {
  @Param({
    name: "word",
    description: "word for search",
    required: true,
  })
  word: string;
}
