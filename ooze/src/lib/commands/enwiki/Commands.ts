import { CommandArgumentType, type Command } from "../Command";
import {
    cdxIconUserAvatar,
    cdxIconTemplateAdd,
    cdxIconNotice,
    cdxIconSpecialPages,
    cdxIconSpeechBubbleAdd,
    cdxIconSearch
  } from "@wikimedia/codex-icons";
import SettingsUi from "./SettingsUI.svelte";
import SqlWarning from "../settings/SqlWarning.svelte";

export const Commands: Record<string, Command> = {
    // Ooze settings
    "settings": {
        name: "Settings",
        description: "Change OOZE settings.",
        arguments: [
            {
                name: "Search",
                description: "Search for a setting to change.",
                placeholder: "Search...",
                type: CommandArgumentType.plainText,
                validate: () => true,
                icon: cdxIconSearch,
            },
        ],
        validate: () => true,
        // Most of the settings can be done through the settings UI
        // but some people may prefer to use the command line
        headerComponent: SettingsUi,
    },

    // Ooze - communicate directly with the SQL database
    "sql" : {
        name: "Ooze SQL",
        description: "Communicate directly with OOZE's internal SQL database.",
        arguments: [
            {
                name: "Query",
                description: "The SQL query to run.",
                type: CommandArgumentType.plainText,
                validate: () => true,
                
            },
        ],
        validate: () => true,
        headerComponent: SqlWarning,
    },


    // Wiki
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