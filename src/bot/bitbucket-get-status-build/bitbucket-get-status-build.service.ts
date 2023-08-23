import { Injectable } from '@nestjs/common';
import { Client, EmbedBuilder } from 'discord.js';

@Injectable()
export class BitbucketGetStatusBuildService {
  bitbucketWebhookGetStatusBuild(client: Client, data, thread_id) {
    const channel: any = client.channels.cache.get(thread_id);
    if (channel) {
      const commit_status_name = data.commit_status.name;
      const commit_state = data.commit_status.state;

      if (commit_status_name.includes('Pull Request')) {
        const discord_message = new EmbedBuilder()
          .setColor(15548997)
          .setTitle('Webhook data received. Pull Request status skipped.');
        return channel.send({ embeds: [discord_message] });
      }

      const repository_nane = data.repository.full_name;
      const author_name = data.commit_status.commit.author.user.display_name;
      const commit_refname = data.commit_status.refname;
      const name_build = data.commit_status.name;
      const commit_message = data.commit_status.commit.message;

      if (commit_state == 'SUCCESSFULL') {
        const discord_message = new EmbedBuilder()
          .setColor(9291330)
          .setTitle(name_build)
          .setDescription(
            `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`,
          );

        return channel.send({ embeds: [discord_message] });
      } else if (commit_state == 'FAILED') {
        const discord_message = new EmbedBuilder()
          .setColor(14226966)
          .setTitle(name_build)
          .setDescription(
            `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`,
          );

        return channel.send({ embeds: [discord_message] });
      } else if (commit_state == 'INPROGRESS') {
        const discord_message = new EmbedBuilder()
          .setColor(0x2771f2)
          .setTitle(name_build)
          .setDescription(
            `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`,
          );

        return channel.send({ embeds: [discord_message] });
      } else {
        const discord_message = new EmbedBuilder()
          .setColor(0xffc923)
          .setTitle(name_build)
          .setDescription(
            `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`,
          );

        return channel.send({ embeds: [discord_message] });
      }
    }
  }
}
