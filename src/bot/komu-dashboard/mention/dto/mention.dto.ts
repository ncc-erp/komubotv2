import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListMention extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => Boolean || null)
  type: boolean | null;

  @ApiProperty({ required: false })
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  from: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  to: number;
}
