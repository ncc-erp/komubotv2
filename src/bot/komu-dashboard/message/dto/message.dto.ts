import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListMessage extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  content!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  email!: string;
}
