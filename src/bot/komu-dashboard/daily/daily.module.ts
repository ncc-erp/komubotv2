import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Daily } from 'src/bot/models/daily.entity';
import { DiscordModule } from '@discord-nestjs/core';
import { GetNameChannelService } from 'src/bot/utils/getFullNameChannel/getFullNameChannel.service';
import { User } from 'src/bot/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Daily, User]), DiscordModule.forFeature()],
  controllers: [DailyController],
  providers: [DailyService, GetNameChannelService]
})
export class DailyModule {}
