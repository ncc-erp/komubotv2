import { Controller, Post, Req, Res } from '@nestjs/common';
import { bitbucketWebhookGetPRService } from './bitbucketWebhookGetPR.service';
import { WebhookClient, EmbedBuilder, Client } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';

//
@Controller('bitbucketWebhookGetPR')
export class bitbucketWebhookGetPRController {
  constructor(
    @InjectDiscordClient()
    private client: Client,
    private readonly webhookService: bitbucketWebhookGetPRService,
  ) {}

  @Post(':server_id/:channel_id/:thread_id')
  async bitbucketWebhookGetPR(@Req() req, @Res() res) {
    const data = req.body;
    // const server_id = req.params.server_id;
    // const channel_id = req.params.channel_id;
    const thread_id = req.params.thread_id;

    return await this.webhookService.bitbucketWebhookGetPR(
      this.client,
      data,
      thread_id,
    );
  }
}
