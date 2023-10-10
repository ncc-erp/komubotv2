import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Query
} from "@nestjs/common";
import { UserService } from "./user.service";
import { getListUser } from "./dto/user.dto";
import { getListUserEdit, getListUserDeactive  } from "./dto/editUser.dto";
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

  @Post("edit")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async edit(@Body() query: getListUserEdit) {
    return await this.userService.editUser(query);
  }

  @Post("deactive")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deactive(@Body() query: getListUserDeactive ) {
    return await this.userService.deactiveUser(query);
  }

  @Delete(":id")
  @UseGuards(JWTAuthGuard)
  async deleteActive(@Param('id') id: string) {
    return await this.userService.deleteActive(id);
  }
}
