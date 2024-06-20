import { Param } from "@discord-nestjs/core";

export class DynamicDto {
  @Param({
    name: "command",
    description: "what ever you want to command",
    required: true,
  })
  command: string;
  @Param({
    name: "output",
    description: "Name or URL of emoji",
    required: true,
  })
  output: string;
}
