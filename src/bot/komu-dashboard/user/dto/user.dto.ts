import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListUser extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  email!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  roles!: string[];

  @ApiProperty({ required: false })
  @Type(() => String)
  roles_discord!: string[];

  @ApiProperty({ required: false })
  @Type(() => Boolean)
  deactive!: boolean;
}
