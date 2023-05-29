import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListChannel extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  name!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  type!: string;
}
