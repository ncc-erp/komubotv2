## Description

`This is a Discord BOT using NestJS and Discord.js copyrighted by NCC PLUS`

<!-- ### INTRODUCTION
   -->

### KOMUBOT V2

## Installation

```bash
# In root project
$ yarn
```

Add next `.env` config in root

```dotenv
TOKEN=YourToken
GUILD_ID_WITH_COMMANDS=YourGuildId
POSTGRES_HOST=YourHost
POSTGRES_PORT=YourPort
POSTGRES_USER=YourUser
POSTGRES_PASSWORD=YourPassword
POSTGRES_DB=YourDB
```

## Running the app

```bash
# In root project
$ yarn run build

# In this sample
$ yarn run start:dev
```

## Help

```bash
#Show Help Menu
*help
```

## KOMU FUNCTIONS

**If you want to use it, please put `*` in front**

1. KOMU

- bzz : `*bzz @username`
- buzz: `send message`
- roomate
- leave: `*leave minute reason`
- meeting:
  - `*meeting`
  * `*meeting cancle`
  * `*meeting now`
  * `*meeting task dd/MM/YYYY HH:mm repeat timerepeat`
  * `*meeting task dd/MM/YYYY HH:mm once`
  * `*meeting task dd/MM/YYYY HH:mm daily`
  * `*meeting task dd/MM/YYYY HH:mm weekly`
- wfh
  - `*wfh daily`
  - `*wfh weekly`
  - `*wfh dd/MM/YYYY`
- remind: `*remind @username dd/MM/YYYY HH:mm content`
- cl
- userstatus: `*userstatus username`
- timesheet: `Please log timesheet follow this template:`
  - `*timesheet help`
  - `*timesheet [projectCode] dd/mm/yyyy` <br> `+ task description; 2h, nt, coding` <br> `+ task description; 2h, nt, coding` <br> `+ task description; 2h, nt, coding`
- toggleactivation:
  - `*toggleactivation username`
  - `*toggleactivation id`
- thongbao: `Thong bao`
- order: `*oder <food>`
- poll: `create a poll`
- update `update point quiz user`
- mv: `move channel`
  - `*mv <this|channel> <category>`
- sync: `WFH Daily`
- sync_role_discord: `WFH Daily`
- kick: `kickbot`
- workout: `workout`
  - `*workout summary`
  - `*workout update email point`
  - `*workout reset point`
  - `*workout`
- gem: `Gem rank`
  - `*gem rank`
  - `*gem rank username`
- opentalk: `Register Opentalk`
  - `*opentalk`
- happy: `create a poll`
- chuc: `create a poll`
- bwl: `BWL leaderboard`
  - `*bwl channel_id top dd/mm/yyyy` <br> `channel_id : right click to the channel & copy`
- checklist: `BWL leaderboard`
  - `*bwl channel_id top dd/mm/yyyy` <br> `channel_id : right click to the channel & copy`
- daily:`Please daily follow this template`
  - `*daily [projectCode] [date]` <br>
    `yesterday: what you have done yesterday` <br>
    `today: what you're going to to today; 2h` <br>
    `block: thing that block you`
- penalty: `penalty`
  - `*penalty @username ammount<50k> reason`
  - `*penalty summary`
  - `*penalty detail @username`
  - `*penalty clear`
- ncc8: `Ncc8`
  - `*ncc8 play episode`
- holiday: `Holiday`
  - `*holiday register dd/MM/YYYY content`
- individual: `Individual Channel`
  - `*individual add @username`
  - `*individual create <channelName>`
  - `*individual remove @username`
  - `*individual delete <channelId>`
- rename : `renameChannel message`
  - `If you are not ADMIN: You do not have permission to execute this command!`
- call: `*call <username> <message>`
- report: `report`
  - `*report daily`
  - `*report weekly`
  - `*report daily dd/MM/YYYY`
- tx8: `YEP lucky draw`

2. GENERAL

- ant
- wol
- botinfo
- help
- vote
- ping
- userinfo
- links
- serverinfo
- addemoji
- avatar