import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
export class GetUserIdByEmailDTO {
  @ApiProperty({ required: true })
  @IsOptional()
  readonly email?: string = "";
}
