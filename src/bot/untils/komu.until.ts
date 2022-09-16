export const sendErrorToDevTest = async (client, authorId, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get("1020251275796955236")
      .send(msg)
      .catch(console.error);
    return null;
  };
  