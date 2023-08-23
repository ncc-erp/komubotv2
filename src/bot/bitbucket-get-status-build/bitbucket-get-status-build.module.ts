import { Module } from '@nestjs/common';
import { BitbucketGetStatusBuildService } from './bitbucket-get-status-build.service';
import { BitbucketGetStatusBuildController } from './bitbucket-get-status-build.controller';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [BitbucketGetStatusBuildController],
  providers: [BitbucketGetStatusBuildService],
})
export class BitbucketGetStatusBuildModule {}
