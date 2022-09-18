import { Controller } from '@nestjs/common';
import { Client, Message, EmbedBuilder  } from "discord.js";
import { sendErrorToDevTest } from 'src/bot/untils/komu.until';

import { CheckListService } from "./checklist.service";




@Controller()
export class CheckListController{
    constructor(
        private checklistService : CheckListService,
    
    ){}
    private categorys = ['tester', 'loren', 'inter', 'dev', 'hr'];
    private subcategorys = [];
    private arr = [];
    async execute(message : Message, args, client) {
      
    
      for (let i = 1; i <= this.categorys.length; i++) {
        this.arr.push(`${i}`);
      }
       let authorId = message.author.id;
       if (!args[0]) {
         let mess;
         for (let i = 0; i <= Math.ceil(this.categorys.length / 50); i += 1) {
           if (this.categorys.slice(i * 50, (i + 1) * 50).length === 0) break;
           mess = this.categorys
             .slice(i * 50, (i + 1) * 50)
             .map((item, index) => {
               return `${index + 1}: ${item}`;
             })
             .join('\n');
           const Embed = new EmbedBuilder ()
             .setTitle(`Checklist`)
             .setColor(0xed4245)
             .setDescription(`${mess}`);
           await message.reply({ embeds: [Embed] }).catch((err) => {
             sendErrorToDevTest(client, authorId, err);
           });
         }
       } else if (args[0] && !args[1]) {
         let option;
         this.subcategorys = [];
     
         if (this.arr.includes(args[0])) {
           option = this.categorys[args[0] - 1];
         } else {
           option = args[0];
         }
     
         let checklists= await this.checklistService.findCategory(option);
         let mess;
         if (checklists.length === 0) {
           mess = '```' + 'There are no categories' + '```';
           return message.reply(mess).catch((err) => {
             sendErrorToDevTest(client, authorId, err);
           });
         } else {
           for (let i = 0; i < checklists.length; i++) {
             this.subcategorys = [...this.subcategorys].concat({
               id: checklists[i].id,
               categoryId: option,
               category: checklists[i].subcategory,
             });
           }
           for (let i = 0; i <= Math.ceil(checklists.length / 50); i += 1) {
             if (checklists.slice(i * 50, (i + 1) * 50).length === 0) break;
             mess = checklists
               .slice(i * 50, (i + 1) * 50)
               .map((item, index) => {
                 return `${index + 1}: ${item.subcategory}`;
               })
               .join('\n');
             const Embed = new EmbedBuilder()
               .setTitle(` Checklist ${option}`)
               .setColor(0xed4245)
               .setDescription(`${mess}`);
             await message.reply({ embeds: [Embed] }).catch((err) => {
               sendErrorToDevTest(client, authorId, err);
             });
           }
         }
       } else if (args[1]) {
         let optionCategory;
         let optionSubcategory;
         let arrSub = [];
     
         if (this.categorys.length === 0 || this.subcategorys.length === 0) {
           return message.reply(`Please *checklist category`).catch((err) => {
             sendErrorToDevTest(client, authorId, err);
           });
         }
     
         if (this.arr.includes(args[0])) {
           optionCategory = this.categorys[args[0] - 1];
         } else {
           optionCategory = args[0];
         }
     
         for (let i = 1; i <= this.subcategorys.length; i++) {
           arrSub.push(`${i}`);
         }
     
         if (arrSub.includes(args[1])) {
           optionSubcategory = this.subcategorys[(args[1] - 1)];
         } else {
           optionSubcategory = this.subcategorys.find((element) => {
             if (element.category === args.slice(1).join(' ')) {
               return true;
             } else {
               return false;
             }
           });
         }
     
         if (optionSubcategory === undefined) {
           return message
             .reply(`You are entering the wrong subcategory`)
             .catch((err) => {
               sendErrorToDevTest(client, authorId, err);
             });
         }
     
         if (optionCategory !== optionSubcategory.categoryId) {
           return message
             .reply(`You are entering the wrong category`)
             .catch((err) => {
               sendErrorToDevTest(client, authorId, err);
             });
         }
     
         let subcategory = await this.checklistService.findCategory( optionSubcategory.id);
     
         let mess;
         if (subcategory.length === 0) {
           mess = '```' + 'There are no subcategories' + '```';
           return message.reply(mess).catch((err) => {
             sendErrorToDevTest(client, authorId, err);
           });
         } else {
           for (let i = 0; i <= Math.ceil(subcategory.length / 50); i += 1) {
             if (subcategory.slice(i * 50, (i + 1) * 50).length === 0) break;
             mess = subcategory
               .slice(i * 50, (i + 1) * 50)
               .map((item) => {
                  console.log('item : ', item);
                 return `${item.category}`;
               })
               .join('\n');
             const Embed = new EmbedBuilder ()
               .setTitle(` ${optionSubcategory.category} (${optionCategory})`)
               .setColor(0xed4245)
               .setDescription(`${mess}`);
             await message.reply({ embeds: [Embed] }).catch((err) => {
               sendErrorToDevTest(client, authorId, err);
             });
           }
           this.subcategorys = [];
         }
    
   }
  }
}


