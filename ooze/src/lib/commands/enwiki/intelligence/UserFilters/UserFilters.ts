import type { MenuItemData } from "@wikimedia/codex";

export interface UserFilter {
    title: string;
    menuItems: MenuItemData[];
}

// When converting a user filter back into a creator element, this has ticked and the dropdown menu item selected
interface UserFilterConversionResult {
    ticked: boolean;
    // Value - if null we'll warn that by making changes to the filter, the selected menu item will be lost
    selectedMenuItem: string | null;
    // No need for include/exclude here as it's processed in the filter
}

const UserFilters: Record<string, UserFilter> = {
    "gf": {
        title: "Average Good Faith",
        menuItems: [
            {
                value: 90,
                label: "more than 90%",
                description: `
              Use 'Include' to only return editors who are very likely to be acting in good faith.
              `,
            },
            {
                value: 75,
                label: "more than 75%",
                description: `
              Use 'Include' to only return editors who are increasingly likely to be acting in good faith.
              `,
            },

            {
                value: 50,
                label: "more than 50%",
                description: `
              Use 'Include' to only return editors who are likely to be acting in good faith or
              use 'Exclude' to only return editors who are likely to be acting in bad faith.
              `,
            },
            {
                value: 25,
                label: "more than 25%",
                description: `
              Use 'Exclude' to only return editors who are increasingly likely to be acting in bad faith.
              `,
            },
            {
                value: 10,
                label: "more than 10%",
                description: `
              Use 'Exclude' to only return editors who are very likely to be acting in bad faith.
              `,
            }
        ]
    },

    "v": {
      title: "Average Vandalism Score",
      menuItems: [
          {
              value: 90,
              label: "more than 90%",
              description: `
              Use 'Include' to only return editors who are very likely to be acting in bad faith.
              `,
          },
          {
              value: 75,
              label: "more than 75%",
              description: `
              Use 'Include' to only return editors who are increasingly likely to be acting in bad faith.
              `,
          },

          {
              value: 50,
              label: "more than 50%",
              description: `
              Use 'Include' to only return editors who are likely to vandals or
              use 'Exclude' to only return editors who are likely to be acting in good faith.
              `,
          },
          {
              value: 25,
              label: "more than 25%",
              description: `
              Use 'Exclude' to only return editors who are increasingly likely to be vandals.
              `,
          },
          {
              value: 10,
              label: "more than 10%",
              description: `
              Use 'Exclude' to only return editors who are very likely to be vandals.
              `,
          }
      ]
    },

    // Current warning level (enwiki specific)
    "w" : {
      title: "Current Warning Level",
      menuItems: [
        {
          value: 4, // Final warning or Only warning
          label: "Final warning or Only warning",
          description: `Use 'Include' to only return editors who have received a final warning (level 4) or only warning (level 4im).`
        },
        {
          value: 3, // Level 3
          label: "Warning",
          description: `Use 'Include' to only return editors who have received a level 3 warning.`
        },
        {
          value: 2, // Level 2
          label: "Caution",
          description: `Use 'Include' to only return editors who have received a level 2 caution.`
        },
        {
          value: 1, // Level 1
          label: "Notice",
          description: `Use 'Include' to only return editors who have received a level 1 notice.`
        },
        {
          value: 0, // No warnings
          label: "No warnings",
          description: `Use 'Exclude' to only return editors who have received warnings.`
        }
      ]
    },

    // Blocked (right now)
    "b" : {
      title: "Block Status",
      menuItems: [
        {
          value: 1,
          label: "Permanent",
          description: `Use 'Include' to only return editors who are currently blocked.`
        },
        {
          value: 0,
          label: "Temporary",
          description: `Use 'Exclude' to only return editors who are not currently blocked.`
        }
      ]
    },

    // AIV report status
    "aiv" : {
      title: "Reported to AIV",
      menuItems: [
        {
          value: 1,
          label: "Reported",
          description: `Use 'Include' to only return editors who have been reported to AIV.`
        },
      ]
    },

    "rights": {
      title: "User Rights",
      menuItems: [
        {
          value: "confirmed",
          label: "Confirmed users",
        },

        {
          value: "extendedconfirmed",
          label: "Confirmed and Extended confirmed users",
        },

        // Rollbacker
        {
          value: "rollbacker",
          label: "Rollback Enabled and Admins",
        },

        {
          value: "sysop",
          label: "Administrators",
        },
      ]
    },

    "anon": {
      title: "Anonymous users",
      menuItems: [
        {
          value: 1,
          label: "IP users",
        },
      ]
    },

    "ec": {
      title: "Edit count",
      menuItems: [
        {
          value: 100,
          label: "100+",
          description: `Use 'Include' to only return editors who have made 100 or more edits.`
        },
        {
          value: 500,
          label: "500+",
          description: `Use 'Include' to only return editors who have made 500 or more edits.`
        },
        {
          value: 1000,
          label: "1000+",
          description: `Use 'Include' to only return editors who have made 1000 or more edits.`
        },
        {
          value: 5000,
          label: "5000+",
          description: `Use 'Include' to only return editors who have made 5000 or more edits.`
        },
        {
          value: 10000,
          label: "10000+",
          description: `Use 'Include' to only return editors who have made 10000 or more edits.`
        },
      ]
    }
};

export default UserFilters;