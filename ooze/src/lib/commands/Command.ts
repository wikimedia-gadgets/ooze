// Types for commands

/*
A command consists of:
- Command starter
then arguments of these types:

And optionally, always last in a command is the "reason/description" for the command.
*/

export interface Command {
    name: string;
    description: string;
    helpPage?: string;
    arguments?: CommandArgument[];
    hasReason?: boolean; // If the command has a reason/description at the end of arguments
    validate: (args: string[]) => boolean;
}

export enum CommandArgumentType {
    "user", // Has quick link
    "page",
    "warningTemplate",
    "welcomeTemplate",
    "plainText",
}

export interface CommandArgument {
    name: string;
    description: string;
    type: CommandArgumentType;
    validate: (arg: string) => boolean;
}

