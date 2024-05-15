import { Param } from "@discord-nestjs/core";

export class CronjobDto {
    @Param({
        name: "timeout",
        description: "set time display message",
        required: true,
      })
      timeout: string;
    
      @Param({
        name: "message",
        description: "input message",
      })
      message: string;
}