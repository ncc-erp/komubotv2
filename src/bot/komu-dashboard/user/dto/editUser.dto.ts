import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Pageable } from "src/bot/utils/commonDto";

export class getListUserEdit {

    @ApiProperty({ required: false })
    @Type(() => String)
    userId!: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    username!: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    email!: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    roles!: string[];

    @ApiProperty({ required: false })
    @Type(() => String)
    roles_discord!: string[];
}

export class getListUserDeactive {
    @ApiProperty({ required: false })
    @Type(() => String)
    userId!: string;
}