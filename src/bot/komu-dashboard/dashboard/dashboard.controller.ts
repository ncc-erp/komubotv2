import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  // @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reportKomubot() {
    return await this.dashboardService.getReportKomubot();
  }

  @Get("reportMsg")
  // @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reportMsg() {
    return await this.dashboardService.getReportMsg();
  }

  @Get("reportMsgMonthly")
  // @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reportMsgMonthly() {
    return await this.dashboardService.getReportMsgMonthly();
  }

  @Get("streamFile")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logStreamFile() {
    return await this.dashboardService.streamFile();
  }

  @Get("reportRoleType")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reportRoleType() {
    return await this.dashboardService.getReportRoleType();
  }
}
