import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class Pageable {
  @ApiProperty({required: false})
  @IsOptional()
  page?: number

  @ApiProperty({required: false})
  @IsOptional()
  size?: number

  @ApiProperty({required: false})
  @IsOptional()
  sort?: string
}

export interface Paging<T> {
  content: T[],
  pageable: {
    page: number,
    size: number,
    total: number
  }
}
