import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListDaily extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  email!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  from!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  to!: string;
}
