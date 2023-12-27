// Types for commands

/*
A command consists of:
- Command starter
then arguments of these types:

And optionally, always last in a command is the "reason/description" for the command.
*/

export interface Command {
    name: string;
    command: string;
    aliases: string[];
    description: string;
    helpPage?: string;
}

export enum CommandArgumentType {
    "user",
    "page",
    "warningTemplate",
    "welcomeTemplate",
    "reason",
    "description",
}

export interface CommandArgument {
    name: string;
    description: string;
    type: CommandArgumentType;
    validate: (arg: string) => boolean;
}

