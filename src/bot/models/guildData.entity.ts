import { Column, Entity } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.GUILDDATA)
class welcome {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class goodbye {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class autoping {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}

class anti_maj {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_spam {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_mentions {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_dc {
  status: false;
  message: null;
  channel: null;
  image: false;
}

export class channel {
  @Column({ nullable: false })
  serverID: string;

  @Column({ nullable: true })
  prefix: string;

  @Column({ nullable: false })
  lang: string;

  @Column({ default: false })
  premium: string;

  @Column({ default: false })
  premiumUserID: string;

  @Column({ default: false })
  chatbot: string;

  @Column({ default: false })
  ignored_channel: string;

  @Column({ default: false })
  admin_role: string;

  @Column({ default: false })
  goodPremium: string;

  @Column({ default: false })
  requestChannel: string;

  @Column({ default: false })
  requestMessage: string;

  @Column({ default: false })
  defaultVolume: string;

  @Column({ default: false })
  vc: string;
  @Column({ default: false })
  clearing: string;

  @Column({ default: false })
  auto_shuffle: string;

  @Column({ default: false })
  games_enabled: string;

  @Column({ default: false })
  util_enabled: string;

  @Column({ default: false })
  autorole: string;

  @Column({ default: false })
  autorole_bot: string;

  @Column({ default: false })
  dj_role: string;

  @Column({ default: false })
  count: string;

  @Column({ default: false })
  autopost: string;

  @Column({ default: false })
  suggestions: string;

  @Column({ default: false })
  color: string;

  @Column({ default: false })
  backlist: string;

  @Column({ default: false })
  autonick: string;

  @Column({ default: false })
  autonick_bot: string;

  @Column({ default: false })
  autoplay: string;

  @Column({ default: null,nullable: true })
  song: string;

  @Column({ default: null, nullable: true })
  h24: string;

  @Column({ default: true, nullable: true })
  announce: string;

  @Column({ default: { welcome, goodbye, autoping } })
  plugins: object;

  @Column({
    default: {
      anti_maj,
      anti_spam,
      anti_mentions,
      anti_dc,
      anti_pub: null,
      antiraid_logs: null,
    },
  })
  protections: object;
}
