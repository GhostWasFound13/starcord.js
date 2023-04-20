
import { Database } from "./Structures/Database.js"
import { CommandInteraction, Interaction, Message } from "discord.js"
import { Bot } from "./Structures/BaseClient"
import { Queue } from "discord-music-player"

export interface BotOptions {
    token: string,
    prefix: string,
    intents: number | object,
    database: Database
}

export interface PlaySongOptions {
    queue: Queue,
    songName: string,
    requestedBy: string | number,
    guildId: string,
    voiceChannelId: string
}

export interface SkipSongOptions {
    guildId: string
}

export interface StopSongOptions {
    guildId: string
}

export interface SetMusicVolumeOptions {
    guildId: string,
    volume: number
}

export interface ClearQueueOptions {
    guildId: string
}

export interface ShuffleQueueOptions {
    guildId: string
}

export interface PauseQueueOptions {
    guildId: string
}

export interface ResumeQueueOptions {
    guildId: string
}

export interface LoopMusicOptions {
    type: 'OFF' | 'QUEUE' | 'SONG',
    guildId: string
}

export interface QueueSongsOptions {
    guildID: string
}

export interface BotMusicOptions {
    leaveOnEnd?: boolean,
    leaveOnStop?: boolean,
    leaveOnEmpty?: boolean,
    deafenOnJoin?: boolean,
    timeout?: number,
    volume?: number,
    quality?: string,
    localAddress?: string,
    ytdlRequestOptions?: string
}

export interface BotInMusic {
    bot: Bot
}

export interface ProgressBarOptions {
    guildId: number,
    arrow: string,
    block: string,
    size: number
}

export interface BotStatusOptions {
    status: "online" | "idle" | "dnd",
    activity?: {
        type: 0 | 1 | 2 | 3 | 4,
        name: string,
        url?: string
    }
}

export interface CommandOptions {
    name: string,
    aliases?: string[],
    onlyForIds?: string[] | string,
    permissions?: {
        user: string[],
        bot: string[]
    },
    cooldown?: number,
    execute(
        bot: Bot,
        message: Message,
        args: string[]
    ): void | Promise<void>
}

export interface CommandSettingsOptions {
    onlyForIds?: {
        embed?: MessageEmbedOptions,
        text?: string
    },
    cooldown?: {
        embed?: MessageEmbedOptions,
        text?: string
    },
    permissionsUser?: {
        embed?: MessageEmbedOptions,
        text?: string
    },
    permissionsBot?: {
        embed?: MessageEmbedOptions,
        text?: string
    }
}

export interface SlashCommandOptions {
    name: string,
    description: string,
    options?: object[],
    async execute(
        interaction: CommandInteraction,
        bot: Bot
    ): void | Promise<void>
}

export interface ModalOptions {
    id: string | number,
    title: string
}

export interface ModalTextOptions {
    id: string | number,
    label: string,
    lengthMax?: number,
    lengthMin?: number,
    isRequired?: boolean
}

export interface ButtonOptions {
    id: string,
    label: string,
    style: number,
    disabled?: boolean
}

export interface SelectMenuOptions {
    id: string,
    placeholder: string,
    options: object
}

export interface MessageEmbedOptions {
    title?: string,
    description: string,
    color?: number,
    url?: string,
    thumbnail?: string,
    author?: {
        name: string,
        iconURL: string,
        url?: string
    },
    image?: string,
    footer?: {
        text: string,
        iconURL?: string
    },
    timestamp?: boolean,
    fields?: object
}

export interface VarOptions {
    key: string,
    value: any,
    name: string
}

export interface SetVarOptions {
    key: string,
    value: any
}

export interface AddVarOptions {
    key: string,
    value: number
}

export interface SubVarOptions {
    key: string,
    value: number
}

export interface GetVarOptions {
    key: string
}

export interface DeleteVarOptions {
    name: string
}

export interface DeleteValueVarOptions {
    value: any
}

export interface SortVarOptions {
    name: string,
    separator: string,
    type?: 1 | -1,
    max?: number
}

export interface GetVarsWithNameOptions {
    name: string
}

export interface GetVarsWithValueOptions {
    value: any
}
