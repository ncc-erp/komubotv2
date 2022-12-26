import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class ReportDailyDTO {
  @ApiProperty()
  @IsNotEmpty()
  date: string;
}
