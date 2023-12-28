import { CommandArgumentType, type Command } from "../Command";
import Warn from "./components/Warn.svelte";

export const Commands: Record<string, Command> = {
    // Welcome
    "we": {
        name: "Welcome",
        description: "Welcome a user to Wikipedia.",
        arguments: [
            {
                name: "User",
                description: "The user to welcome.",
                type: CommandArgumentType.user,
                validate: () => true,
            },
            {
                name: "Template",
                description: "The welcome template to use.",
                type: CommandArgumentType.welcomeTemplate,
                validate: () => true,
            },
        ],
        hasReason: true,
        validate: () => true,
    },

    // Warn
    "w": {
        name: "Warn",
        description: "Warn a user.",
        arguments: [
            {
                name: "User",
                description: "The user to warn.",
                type: CommandArgumentType.user,
                validate: () => true,
            },
            {
                name: "Template",
                description: "The warning template to use.",
                type: CommandArgumentType.warningTemplate,
                validate: () => true,
            },
        ],
        hasReason: true,
        validate: () => true,
        headerComponent: Warn,
    },
};