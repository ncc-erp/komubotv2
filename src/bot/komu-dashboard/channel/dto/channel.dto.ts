import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListChannel extends Pageable {
  @ApiProperty({ required: false })
  @Type(() => String)
  name!: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  type!: string;
}

export class getListChannelMember  {
  @ApiProperty({ required: false })
  @Type(() => String)
  id: string;

  @ApiProperty({ required: false })
  @Type(() => String )
  searchId: string;
}

export class PostRemoteMemberChannel {
  @ApiProperty({ required: false })
  @Type(() => String)
  channelId: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  userId: string;
}


export class GetSearchMemberChannel {
  @ApiProperty({ required: false })
  @Type(() => String)
  name: string;
}
