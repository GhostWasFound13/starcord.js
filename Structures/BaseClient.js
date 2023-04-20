
import { Client, Collection, EmbedBuilder, ActivityType } from "discord.js"
import { FileError, TokenError, TypeError } from './Error.js'
import consola from 'consola'
import * as fs from "fs"
Client.prototype.token = "The token was hidden for security reasons, sorry"
import { createRequire } from "module";
import { Database } from "./Database.js"
import { MusicClient } from "./Music.js"
const require = createRequire(import.meta.url);

export class Bot extends Client {
    /**
     * @param { import("../typings.js").BotOptions } options - Settings data to the client
     * @param { import("../typings.js").CommandSettingsOptions } cmdOptions - Settings for commands
    */
    constructor(options, cmdOptions) {
      super({intents: options.intents})
      this.token = options.token
      this.prefix = options.prefix
      this.cmds = new Collection()
      this.aliases = new Collection()
      this.slash = new Collection()
      this.db = options.database
      this.cmdOptions = cmdOptions || {}
      this.cooldowns = new Collection
      if(this.db instanceof Database) consola.success("The database is loaded!")
      else consola.warn("You're using an unsupported database, but it's loaded anyway!")
      this.status;
      this.started = Date.now() 
      this.start()
      if(process.version.replace("v", "").split(".")[0] < 16) {
        consola.fatal("You're using a version below v16! For stable operation of the mncord, you need version v16 and higher!")
        process.exit()
      }
      this.on("messageCreate", async(message) => {
        const bot = this
        let prefix = bot.prefix
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(prefix)) return;
        if (!message.member) message.member = await message.guild.fetchMember(message);
    
        const args = message.content.slice(bot.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
    
        if (cmd.length === 0) return;
      
        let command = bot.cmds.get(cmd);
        if (!command) command = bot.cmds.get(this.aliases.get(cmd));
        if (command) {
          command.permissions = command.permissions || {
            user: ['SendMessages'],
            bot: ['SendMessages']
          }
          command.permissions.user = command.permissions.user || ['SendMessages']
          command.permissions.bot = command.permissions.bot || ['SendMessages']
          if(command.permissions.user && command.permissions.bot) {
            const uPerms = message.member.permissions.toArray()
            const bPerms = message.guild.members.me.permissions.toArray()
            let tfUser = []
            let tfBot = []
            let fpUser = []
            let fpBot = []

            command.permissions.user.forEach((a) => {
              tfUser.push(uPerms.includes(a))
              if(!uPerms.includes(a)) fpUser.push(a)
            })

            command.permissions.bot.forEach((a) => {
              tfBot.push(bPerms.includes(a))
              if(!bPerms.includes(a)) fpBot.push(a)
            })
            if(!tfUser.includes(false) && !tfBot.includes(false)) {
              if(!command.onlyForIds) {
                command.onlyForIds = this.users.cache.map(x => x.id)
              }
              if(command.onlyForIds.includes(message.author.id)) {
                if(!command.cooldown) command.cooldown = 0
                if(this.cooldowns.get(`${command.name}_${message.author.id}`)) {
                  if((command.cooldown * 1000) + this.cooldowns.get(`${command.name}_${message.author.id}`) < Date.now()) {
                    
                    await command.execute(bot, message, args);
                    this.cooldowns.set(`${command.name}_${message.author.id}`, Date.now())
                      
                  } else {
                    if(!this.cmdOptions.cooldown) {
                      message.reply(`Wait \`${command.cooldown}\` sec.`)
                    } else {
                      if(this.cmdOptions.cooldown.embed && this.cmdOptions.cooldown.text) {
                        this.cmdOptions.cooldown.embed.description = this.cmdOptions.cooldown.embed.description.replaceAll("{cooldown}", command.cooldown)
                        this.cmdOptions.cooldown.text = this.cmdOptions.cooldown.text.replaceAll("{cooldown}", command.cooldown)
                        message.reply({
                          content: this.cmdOptions.cooldown.text,
                          embeds: [this.cmdOptions.cooldown.embed]
                        })
                      } else {
                        if(this.cmdOptions.cooldown.embed) {
                          this.cmdOptions.cooldown.embed.description.replaceAll("{cooldown}", command.cooldown)
                          message.reply({
                            embeds: [this.cmdOptions.cooldown.embed]
                          })
                        } else {
                          this.cmdOptions.cooldown.text = this.cmdOptions.cooldown.text.replaceAll("{cooldown}", command.cooldown)
                          message.reply({
                            content: this.cmdOptions.cooldown.text
                          })
                        }
                      }
                    }
                  }
                } else {
                  await command.execute(bot, message, args);
                  this.cooldowns.set(`${command.name}_${message.author.id}`, Date.now())
                }
              } else {
                if(!this.cmdOptions.onlyForIds) {
                  message.reply(`This command is only available for \`${command.onlyForIds.join(", ")}\``)
                } else {
                  if(this.cmdOptions.onlyForIds.embed && this.cmdOptions.onlyForIds.text) {
                    this.cmdOptions.onlyForIds.embed.description = this.cmdOptions.onlyForIds.embed.description.replaceAll("{ids}", command.onlyForIds.join(", "))
                    this.cmdOptions.onlyForIds.text = this.cmdOptions.onlyForIds.text.replaceAll("{ids}", command.onlyForIds.join(", "))
                    message.reply({
                      content: this.cmdOptions.onlyForIds.text,
                      embeds: [this.cmdOptions.onlyForIds.embed]
                    })
                  } else {
                    if(this.cmdOptions.onlyForIds.embed) {
                      this.cmdOptions.onlyForIds.embed.description = this.cmdOptions.onlyForIds.embed.description.replaceAll("{ids}", command.onlyForIds.join(", "))
                      message.reply({
                        embeds: [this.cmdOptions.onlyForIds.embed]
                      })
                    } else {
                      this.cmdOptions.onlyForIds.text = this.cmdOptions.onlyForIds.text.replaceAll("{ids}", command.onlyForIds.join(", "))
                      message.reply({
                        content: this.cmdOptions.onlyForIds.text
                      })
                    }
                  }
                }
              }
            } else {
                if(tfUser.includes(false)) {
                  if(!this.cmdOptions.permissionsUser) {
                    message.reply(`I'm sorry, but you don't have these rights \`${fpUser.join(', ')}\``)
                  } else {
                    if(this.cmdOptions.permissionsUser.embed || this.cmdOptions.permissionsUser.text) {
                      if(this.cmdOptions.permissionsUser.embed && this.cmdOptions.permissionsUser.text) {
                        this.cmdOptions.permissionsUser.embed.description = this.cmdOptions.permissionsUser.embed.description.replaceAll('{perms}', fpUser.join(', '))
                        this.permissionsUser.text = this.permissionsUser.text.replaceAll('{user}', message.author.id)
                        this.cmdOptions.permissionsUser.embed.description = this.cmdOptions.permissionsUser.embed.description.replaceAll('{user}', message.author.id)
                        this.permissionsUser.text = this.permissionsUser.text.replaceAll('{perms}', fpUser.join(', '))
                        message.reply({
                          content: this.permissionsUser.text,
                          embeds: [this.cmdOptions.permissionsUser.embed]
                        })
                      } else {
                        if(this.permissionsUser.text) {
                          this.permissionsUser.text = this.permissionsUser.text.replaceAll('{user}', message.author.id)
                          this.permissionsUser.text = this.permissionsUser.text.replaceAll('{perms}', fpUser.join(', '))
                          message.reply({
                            content: this.permissionsUser.text
                          })
                        } else {
                          this.cmdOptions.permissionsUser.embed.description = this.cmdOptions.permissionsUser.embed.description.replaceAll('{perms}', fpUser.join(', '))
                          this.cmdOptions.permissionsUser.embed.description = this.cmdOptions.permissionsUser.embed.description.replaceAll('{user}', message.author.id)
                          message.reply({
                            embeds: [this.cmdOptions.permissionsUser.embed]
                          })
                        }
                      }
                    }
                  }
                } else {
                  if(!this.cmdOptions.permissionsBot) {
                    message.reply(`I'm sorry, but I don't have these rights \`${fpBot.join(', ')}\``)
                  } else {
                      if(this.cmdOptions.permissionsBot.embed && this.cmdOptions.permissionsBot.text) {
                        this.cmdOptions.permissionsBot.embed.description = this.cmdOptions.permissionsBot.embed.description.replaceAll('{perms}', fpBot.join(', '))
                        this.cmdOptions.permissionsBot.text = this.cmdOptions.permissionsBot.text.replaceAll('{user}', message.guild.members.me.id)
                        this.cmdOptions.permissionsBot.embed.description = this.cmdOptions.permissionsBot.embed.description.replaceAll('{user}', message.guild.members.me.id)
                        this.cmdOptions.permissionsBot.text = this.cmdOptions.permissionsBot.text.replaceAll('{perms}', fpBot.join(', '))
                        message.reply({
                          content: this.cmdOptions.permissionsBot.text,
                          embeds: [this.cmdOptions.permissionsBot.embed]
                        })
                      } else {
                        if(this.cmdOptions.permissionsBot.text) {
                          this.cmdOptions.permissionsBot.text = this.cmdOptions.permissionsBot.text.replaceAll('{user}', message.guild.members.me.id)
                          this.cmdOptions.permissionsBot.text = this.cmdOptions.permissionsBot.text.replaceAll('{perms}', fpBot.join(', '))
                          message.reply({
                            content: this.cmdOptions.permissionsBot.text
                          })
                        } else {
                          this.cmdOptions.permissionsBot.embed.description = this.cmdOptions.permissionsBot.embed.description.replaceAll('{perms}', fpBot.join(', '))
                          this.cmdOptions.permissionsBot.embed.description = this.cmdOptions.permissionsBot.embed.description.replaceAll('{user}', message.guild.members.me.id)
                          message.reply({
                            embeds: [this.cmdOptions.permissionsBot.embed]
                          })
                        }
                      }
                  }
                }
              }
            }
          }
      })
      this.on("interactionCreate", async(interaction) => {
        if (!interaction.isCommand()) return;

        const command = this.slash.get(interaction.commandName);
        if (!command) return;
        let bot = this
        try {
          await command.execute( interaction, bot );
        } catch (err) {
          console.log(err);

          await interaction[interaction.deferred ? 'editReply' : interaction.replied ? 'followUp' : 'reply']({
            embeds: [new EmbedBuilder().setDescription(err.message || '?')]
          });
        }
      })
      this.once("ready", async(client) => {
        consola.success(`Launched as ${client.user.tag}`)
        if(this.status) {
          if(!this.status.activity) {
            client.user.setPresence({
              status: this.status.status
            })
          } else {
            client.user.setPresence({
              activities: [this.status.activity],
              status: this.status.status
            })
          }
        }
        this.token = `There is no token`
        this.dbsize = await this.db.size
      })
    }

    get ownerID() {
      return (this.application.fetch()).then(x => x.owner.id)
    }

    get token() {
      return "The token was hidden for security reasons, sorry"
    }

    get size() {
      let guilds = this.guilds.cache
      let b = 0
      guilds.forEach((a) => {
        b += a.members.cache.size
      })
      const obj = {
        users: b,
        guilds: this.guilds.cache.size,
        channels: this.channels.cache.size,
        emojis: this.emojis.cache.size,
        aliases: this.aliases.size,
        cmds: this.cmds.size,
        slash: this.slash.size
      }
      return obj
    }

    get uptime() {
      let weeks = Math.floor((Date.now() - this.started) / 604800000)
      let days = Math.floor((Date.now() - this.started) / 86400000) % 7
      let hours = Math.floor((Date.now() - this.started) / 3600000) % 24;
      let minutes = Math.floor((Date.now() - this.started) / 60000) % 60;
      let seconds = Math.floor((Date.now() - this.started) / 1000) % 60;
      let up;
      if (weeks == 0 && days == 0 && hours == 0 && minutes == 0) up = `${seconds}с`
      else if (weeks == 0 && days == 0 && hours == 0) up = `${minutes}м ${seconds}с`
      else if (weeks == 0 && days == 0) up = `${hours}ч ${minutes}м ${seconds}с`
      else if (weeks == 0) up = `${days}д ${hours}ч ${minutes}м ${seconds}с`
      else up = `${weeks} ${days}д ${hours}ч ${minutes}м ${seconds}с`
      const obj = {
        uptimeNum: (Date.now() - this.started),
        uptimeStr: up
      }
      return obj
    }

    /**
     * @param { import("../typings.js").CommandOptions } options - Options given to the new command
     */
    command(options) {
      this.cmds.set(options.name, options)
      if(options.aliases && Array.isArray(options.aliases)) options.aliases.forEach(alias => this.aliases.set(alias, options.name));
    }

    /**
     * @param { import("../typings.js").SlashCommandOptions } options - Options given to the new command
     */
    slashCommand(options, execute) {
      this.slash.set(options.name, options)
    }

    async start() {
      if(this.token) {
        try {
          await this.login(this.token)
          consola.success("Successfully launched")
        } catch {
          const err = new TokenError("The token is incorrect!")
          consola.error(`${err.message}`)
        }
        setTimeout(async() => {
          if(this.slash.size != 0) {
            await this.application.commands.set(this.slash);
            consola.info("Slash commands loaded")
          }
        }, 2000)
      } else {
        const err = new TokenError("The token is not specified")
        consola.error(`${err.message}`)
      }
    }
    /**
     * @param {import("../typings.js").BotStatusOptions} options - Settings status
     */
    setStatus(options) {
      this.status = options 
    }
}
