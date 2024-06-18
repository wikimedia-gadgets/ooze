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
    validate: (args: string[]) => boolean;
    headerComponent?: any;
    noStateBoundHeader?: boolean;
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
    validate: (arg: string) => string | true; // Return string if invalid, true if valid
    helperElement?: any; // This shows when the argument is selected - used for shortcuts etc
    noBindHelper?: boolean; // Don't bind the helper element to the commandInputValue
    optional?: boolean;
}

