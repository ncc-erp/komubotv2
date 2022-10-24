import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Column } from "typeorm";

export class SendMessageToChannelDTO {
  @ApiProperty({ required: true })
  @IsOptional()
  channelid?: string = "";

  @ApiProperty({ required: true })
  @IsOptional()
  message?: string = "";

  @ApiProperty({ required: true })
  @IsOptional()
  machleo?: boolean;

  @ApiProperty({ required: true })
  @IsOptional()
  machleo_userid?: string = "";

  @ApiProperty({ required: true })
  @IsOptional()
  wfhid?: string = "";

  @ApiProperty({ required: true })
  @IsOptional()
  username?: string = "";

  @ApiProperty({ required: true })
  @IsOptional()
  createdate?: Date;
}
