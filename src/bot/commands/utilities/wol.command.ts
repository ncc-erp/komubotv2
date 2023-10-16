import { CommandLine, CommandLineClass } from "../../base/command.base";
import wol from "wake_on_lan";
import find from "local-devices";
import broadcastAddress from "broadcast-address";
import os from "os";
import net from "net";
import { Message } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { WOL } from "src/bot/models/wol.entity";
import { Repository } from "typeorm";

function getAvailableBroadcastAddresses() {
  const interfacesNames = Object.keys(os.networkInterfaces());
  const addresses = [];
  for (const name of interfacesNames) {
    try {
      const addr = broadcastAddress(name);
      addresses.push(addr);
    } catch (e) {
      // ingnore
      console.log(e);
    }
  }
  return addresses;
}

function discoverDevice(macOrIp, ipAddress) {
  const isIp = (macOrIp || "").indexOf(".") > -1;
  if (!isIp) {
    return Promise.resolve({
      mac: macOrIp,
      ip: ipAddress,
    });
  }
  return find(macOrIp).catch(() => {
    return discoverDeviceFallback(macOrIp);
  });
}

function discoverDeviceFallback(ip) {
  return find(null).then((devices) => {
    return devices.find((dev) => {
      return dev.ip == ip;
    });
  });
}

function wakeDevice(macAddress, netMask, silent) {
  return new Promise((resolve, reject) => {
    wol.wake(
      macAddress,
      { address: netMask, port: 7, num_packets: 3 },
      (error) => {
        if (error && !silent) {
          return reject(new Error("Cannot send WoL packet."));
        }
        return resolve({ macAddress, netMask });
      }
    );
  });
}

function wakeDeviceOnAvailableNetworks(macAddress) {
  const addresses = getAvailableBroadcastAddresses();

  return Promise.all(
    addresses.map((addr) => wakeDevice(macAddress, addr, true))
  );
}

function sendCMDToPfsense(branch, identity, ipAddress) {
  let host;
  switch (branch) {
    case "hn2":
      host = "10.10.40.1";
      break;
    case "hn3":
      host = "10.10.70.1";
      break;
    case "dn":
      host = "10.10.30.1";
      break;
    case "sg1":
      host = "10.10.10.1";
      break;
    case "sg2":
      host = "10.10.50.1";
      break;
    case "vinh":
      host = "10.10.20.1";
      break;
    case "qn":
      host = "10.10.60.1";
      break;
    case "hn1":
    default:
      host = "172.16.10.1";
      break;
  }

  try {
    var client = new net.Socket();
    client.connect(
      {
        host: host,
        port: 6996,
      },
      () => {
        // 'connect' listener
        client.write(`${ipAddress} ${identity}`);
      }
    );

    client.on("data", (data) => {
      client.end();
    });
  } catch (err) {
    console.log(err);
  }
}

function handleWoL(message: Message, args) {
  const identity = args[0];
  const ipAddress = args[1];
  const branch = args[2];
  sendCMDToPfsense(branch, identity, ipAddress);
  return discoverDevice(identity, ipAddress)
    .then((device) => {
      if (!device || !device.mac) {
        console.log(device);
        throw new Error("error while discovering device.");
      }
      return device;
    })
    .then((device) => {
      if (device.ip) {
        return wakeDevice(device.mac, device.ip, null);
      }
      return wakeDeviceOnAvailableNetworks(device.mac);
    })
    .then((res) => {
      if (!res) {
        throw new Error("no WoL packet sent!");
      }
      return message.reply("Done, WoL packet sent!");
    })
    .catch((err) => {
      console.error(err);
      return message.reply(`Failed, ${err.message}`);
    });
}

@CommandLine({
  name: "wol",
  description: "Turn on an pc on LAN (WoL)",
  cat: "utilities",
})
export class WolCommand implements CommandLineClass {
  constructor(
    @InjectRepository(WOL)
    private readonly wolRepository: Repository<WOL>,
  ) { }
  async execute(message, args) {
    try {
      const authorId = message.author.id;
      const timeStamp = Date.now();
      if (!args[0]) {
        const myWOL = await this.wolRepository.findOneBy({ author: authorId })
        if (myWOL) {
          return handleWoL(message, args);
        } else {
          return message.reply("You haven't set up wol");
        }
      } else if (args[0] === "help") {
        return message.reply(
          "Using WoL to turn on an pc on LAN using mac address.\n*wol <your mac> [your ip]\n*tips: you can you *keep command to save your mac and ip"
        );
      } else {
        const wol = args.join(" ")
        const checkUser = await this.wolRepository.findOneBy({ author: authorId })
        if (!checkUser) {
          await this.wolRepository.save({
            author: authorId,
            wol: wol,
            createdAt: timeStamp
          })
        } else {
          await this.wolRepository.update({ author: authorId }, { wol: wol })
        }
        return handleWoL(message, args);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
