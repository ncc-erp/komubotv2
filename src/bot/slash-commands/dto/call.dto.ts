import { Param } from "@discord-nestjs/core";

export class CallDto {
  @Param({
    name: "username",
    description: "call username",
    required: true,
  })
  username: string;
}
