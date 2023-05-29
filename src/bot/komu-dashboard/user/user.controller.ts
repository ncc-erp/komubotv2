import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { getListUser } from "./dto/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags('User')
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async findAll(@Body() query: getListUser) {
    return await this.userService.findAll(query);
  }

  @Patch(":userId")
  @UseGuards(JWTAuthGuard)
  async toggleactivation(@Param("userId") userId: string) {
    return await this.userService.toggleActivation(userId);
  }
}
