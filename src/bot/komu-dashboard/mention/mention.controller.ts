import {
    Body,
    Controller,
    Get,
    Query,
    UseGuards,
    Post,
    Param
} from "@nestjs/common";
import { MentionService } from "./mention.service";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import {getListMention} from "./dto/mention.dto";
  
@ApiTags('Mention')
@Controller("mention")
export class MentionController {
    constructor(private readonly mentionService: MentionService) {}
    @Get()
    @UseGuards(JWTAuthGuard)
    async getAll(@Query() query: getListMention) {
        return await this.mentionService.getAll(query);
    }
}