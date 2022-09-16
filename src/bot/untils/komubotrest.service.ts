import { Injectable } from "@nestjs/common";

@Injectable()
export class Komubotrest {
  checkNumber = (string) =>
    !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);
     sendErrorToDevTest = async (client, authorId, err) => {
      const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
      await client.channels.cache
        .get(process.env.KOMUBOTREST_DEVTEST_CHANNEL_ID)
        .send(msg)
        .catch(console.error);
      return null;
    };
}

