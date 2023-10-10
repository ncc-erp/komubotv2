import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListMessage extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  title!: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  from!: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  to!: number;
}
