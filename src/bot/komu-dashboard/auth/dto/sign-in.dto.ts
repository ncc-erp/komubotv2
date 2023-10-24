import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SignIn {
  @ApiProperty()
  @IsNotEmpty({ message: "mustBeNotEmpty" })
  @IsOptional()
  readonly username: string = "";

  @ApiProperty()
  @IsNotEmpty({ message: "mustBeNotEmpty" })
  @IsOptional()
  readonly password: string = "";
}

export class AuthGoogleLoginDto {
  @ApiProperty()
  @IsOptional()
  tokenId: string;
}
