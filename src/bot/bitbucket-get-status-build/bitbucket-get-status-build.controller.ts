import { Controller, Post, Res, Req } from '@nestjs/common';
import { BitbucketGetStatusBuildService } from './bitbucket-get-status-build.service';
import { Client, WebhookClient } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';
@Controller('bitbucketGetStatusBuild')
export class BitbucketGetStatusBuildController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly webhookService: BitbucketGetStatusBuildService,
  ) {}

  @Post(':server_id/:channel_id/:thread_id')
  async bitbucketWebhookGetStatusBuild(@Req() req, @Res() res) {
    // const server_id = req.params.server_id;
    // const channel_id = req.params.channel_id;
    const thread_id = req.params.thread_id;
    const data = req.body;

    return await this.webhookService.bitbucketWebhookGetStatusBuild(
      this.client,
      data,
      thread_id,
    );
  }
}
