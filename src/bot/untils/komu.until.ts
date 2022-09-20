
export const sendErrorToDevTest = async (client, authorId, err) => {
  const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
  await client.channels.cache
    .get("995629474987130900")
    .send(msg)
    .catch(console.error);
  return null;
};

export const getWFHWarninghMessage = (content, userId, wfhId) => {
  // const row = new MessageActionRow().addComponents(
  //   new MessageButton()
  //     .setCustomId("komu_wfh_complain#" + userId + "#" + wfhId)
  //     .setLabel("I'am in daily call")
  //     .setEmoji("⏳")
  //     .setStyle("DANGER"),
  //   new MessageButton()
  //     .setCustomId("komu_wfh_accept#" + userId + "#" + wfhId)
  //     .setLabel("Accept")
  //     .setEmoji("✍")
  //     .setStyle("PRIMARY")
  // );
  // return { content, components: [row] };
};
