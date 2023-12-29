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
    reasonTitle?: string; // If the command has a reason/description at the end of arguments
    reasonDescription?: string; // If the command has a reason/description at the end of arguments
    validate: (args: string[]) => boolean;
    headerComponent?: any;
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
    icon?: any; // This shows when typing in the argument
    placeholder?: string; // This shows when typing in the argument
    validate: (arg: string) => boolean;
    optional?: boolean;
}

