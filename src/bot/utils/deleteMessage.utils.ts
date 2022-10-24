import { Client, TextChannel } from "discord.js";
import { DeleteMessageDTO } from "../dto/deleteMessage";

export async function deleteMessage(
  client: Client,
  deleteMessageDTO: DeleteMessageDTO,
  res
) {
  try {
    const fetchMessage = await client.channels.fetch(
      deleteMessageDTO.channelId
    );
    const msg = await (fetchMessage as TextChannel).messages
      .fetch(deleteMessageDTO.messageId)
      .catch((err) => {});
    if (msg) msg.delete();
    res.status(200).send({ message: "Successfully!" });
  } catch (error) {
    console.log(error);
  }
}
