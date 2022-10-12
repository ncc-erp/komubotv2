import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { GetApiWfhService } from "./getApiWfh.service";

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    DiscordModule.forFeature(),
    DiscoveryModule,
    HttpModule,
  ],
  providers: [ClientConfigService, GetApiWfhService, ConfigService],
})
export class getApiWfhModule {}
