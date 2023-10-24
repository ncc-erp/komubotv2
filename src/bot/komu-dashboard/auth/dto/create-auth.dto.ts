import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateAuthDto {
  @ApiProperty({ required: false })
  @Type(() => String)
  email!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  username!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  password!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  confirm_password!: string;
}
