import { Module } from '@nestjs/common';
import { bitbucketWebhookGetPRService } from './bitbucketWebhookGetPR.service';
import { bitbucketWebhookGetPRController } from './bitbucketWebhookGetPR.controller';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [bitbucketWebhookGetPRController],
  providers: [bitbucketWebhookGetPRService],
})
export class bitbucketWebhookGetPRModule {}
