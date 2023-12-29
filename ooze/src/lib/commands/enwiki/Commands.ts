import { CommandArgumentType, type Command } from "../Command";
import {
    cdxIconUserAvatar,
    cdxIconTemplateAdd,
    cdxIconNotice,
    cdxIconSpecialPages,
    cdxIconSpeechBubbleAdd
  } from "@wikimedia/codex-icons";

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
                description: "The user to warn. If the talk page doesn't exist, it will be created.",
                type: CommandArgumentType.user,
                icon: cdxIconUserAvatar,
                placeholder: "Enter a username...",
                validate: () => true,
            },
            {
                name: "Template",
                description: "The warning template to use.",
                type: CommandArgumentType.warningTemplate,
                icon: cdxIconTemplateAdd,
                placeholder: "Type to search, or select from the list...",
                validate: () => true,
            },

            // Warning level
            {
                name: "Level",
                description: "The level of the warning.",
                type: CommandArgumentType.plainText,
                icon: cdxIconNotice,
                placeholder: "Type to search, or select from the list...",
                validate: () => true,
            },

            // Associated page
            {
                name: "Page",
                description: "The page associated with the warning.",
                type: CommandArgumentType.page,
                validate: () => true,
                optional: true,
                icon: cdxIconSpecialPages,
                placeholder: "Enter a page name...",
            },

            // Additional comments
            {
                name: "Comments",
                description: "Additional comments to add to the warning.",
                type: CommandArgumentType.plainText,
                validate: () => true,
                optional: true,
                icon: cdxIconSpeechBubbleAdd,
                placeholder: "Enter additional comments...",
            },
        ],
        validate: () => true,
    },
};