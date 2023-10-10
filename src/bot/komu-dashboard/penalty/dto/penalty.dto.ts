import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListPenalty extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  username!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  amountStart!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  amountEnd!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  from!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  to!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  isReject!: string;
}
