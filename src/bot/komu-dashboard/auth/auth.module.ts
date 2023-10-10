import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UtilsModule } from "src/bot/utils/utils.module";
import { Holiday } from "src/bot/models/holiday.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type {JwtModuleOptions} from '@nestjs/jwt';
import { KomuDashboard } from "src/bot/models/komuDashboard.entity";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([KomuDashboard, Holiday]),
    UtilsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (env: ConfigService): Promise<JwtModuleOptions> => ({
        secret: env.get("JWT_SECRET"),
        signOptions: {
          expiresIn: "1d",
          algorithm: "HS384",
        },
        verifyOptions: {
          algorithms: ["HS384"],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
