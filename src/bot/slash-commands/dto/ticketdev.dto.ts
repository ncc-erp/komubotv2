import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class TicketDevDto {
  @Param({
    name: "query",
    description: "query is add|remove|list",
    required: true,
  })
  query: string;

  @Param({
    name: "assignee",
    description: "assignee email (example: a.nguyenvan)",
    required: true,
  })
  assignee: string;

  @Param({
    name: "task",
    description: "task title (example: Add Login UI)",
  })
  task: string;
}
