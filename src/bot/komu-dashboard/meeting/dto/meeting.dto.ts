import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListMeeting extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  repeat!: string;
  
  @ApiProperty({ required: false })
  @Type(() => String)
  task!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  from!: string;
  
  @ApiProperty({ required: false })
  @Type(() => String)
  to!: string;
  
  @ApiProperty({ required: false })
  @Type(() => String)
  cancel!: string;
}
