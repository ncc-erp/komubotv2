import { Injectable } from "@nestjs/common";
import moment from "moment";
import { Client, EmbedBuilder } from "discord.js";

function format_created_on(created_on) {
  const dt_object = moment(created_on).format("DD--MM-YYYY h:mm:ss");
  return dt_object;
}

@Injectable()
//
export class bitbucketWebhookGetPRService {
  async bitbucketWebhookGetPR(client: Client, data, thread_id) {
    var channel: any = client.channels.cache.get(thread_id);
    if (channel) {
      const pull_request_state = data.pullrequest.state;
      if (pull_request_state != "MERGED") {
        const discord_message = new EmbedBuilder()
          .setColor(15548997)
          .setTitle(
            "Webhook data received, but pull request state is not 'MERGED'."
          );
        return channel.send({ embeds: [discord_message] });
      }
      const pull_request_title = data.pullrequest.title;
      const created_on = data.pullrequest.created_on;
      const created_on_formatted = format_created_on(created_on);
      const branch_destination = data.pullrequest.destination.branch.name;
      const branch_source = data.pullrequest.source.branch.name;

      const reviewers = [];
      const pullRequestReviewers: any[] = data.pullrequest.reviewers;
      pullRequestReviewers.forEach((reviewer) => {
        const reviewer_name = reviewer.display_name;
        reviewers.push(reviewer_name);
      });

      const discord_message = new EmbedBuilder()
        .setColor(0x34ebe5)
        .setTitle(`Pull Request Merged: ${pull_request_title}`)
        .setFields(
          {
            name: "Reviewers",
            value: reviewers.join(","),
            inline: false,
          },
          { name: "Branch Source", value: branch_source, inline: false },
          {
            name: "Branch Destination",
            value: branch_destination,
            inline: false,
          },
          { name: "Created On", value: created_on_formatted, inline: false }
        );

      return channel.send({ embeds: [discord_message] });
    }
  }
}
