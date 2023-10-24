import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { AuthGoogleLoginDto, SignIn } from "./dto/sign-in.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("google")
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() loginDto: AuthGoogleLoginDto) {
    const socialData = await this.authService.getProfileByToken(loginDto);
    return await this.authService.findOne(socialData.email);
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() data: CreateAuthDto): Promise<any> {
    return await this.authService.register(data);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() signIn: SignIn) {
    return await this.authService.login(signIn);
  }
}
