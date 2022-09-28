import { Command, UseGroup } from "@discord-nestjs/core";
import { QuerySubCommand } from "./ticket-subcommand/query.subcommand";

@Command({
  name: "ticketdev",
  description: "manage ticket",
  //   include: [UseGroup(QuerySubCommand)],
})
export class RegistrationCommand {}
