import type { MenuItemData } from "@wikimedia/codex";

export interface UserFilter {
    title: string;
    menuItems: MenuItemData[];
}


const UserFilters: Record<string, UserFilter> = {
    "gf": {
        title: "Average Edit Good Faith",
        menuItems: [
            {
                value: "90",
                label: "higher than 90%",
            },
            {
                value: "75",
                label: "higher than 75%",
            },

            {
                value: "50",
                label: "higher than 50%",
            },
            {
                value: "25",
                label: "higher than 25%",
            },
            {
                value: "10",
                label: "higher than 10%",
            }
        ]
    },

    "v": {
      title: "Average Edit Vandalism Score",
      menuItems: [
          {
              value: "90",
              label: "higher than 90%",
          },
          {
              value: "75",
              label: "higher than 75%",
          },

          {
              value: "50",
              label: "higher than 50%",
          },
          {
              value: "25",
              label: "higher than 25%",
          },
          {
              value: "10",
              label: "higher than 10%",
          }
      ]
    },

    // Current warning level (enwiki specific)
    "w" : {
      title: "Current Warning Level",
      menuItems: [
        {
          value: "4", // Final warning or Only warning
          label: "Final warning or Only warning",
        },
        {
          value: "3", // Level 3
          label: "Warning (or higher)",
        },
        {
          value: "2", // Level 2
          label: "Caution (or higher)",
        },
        {
          value: "1", // Level 1
          label: "Notice (or higher)",
        },
        {
          value: "0", // No warnings
          label: "No warnings",
        }
      ]
    },

    // Blocked (right now)
    "b" : {
      title: "Block Status",
      menuItems: [
        {
          value: "p",
          label: "Permanent",
        },
        {
          value: "t",
          label: "Temporary",
        },

        {
          value: "b",
          label: "Partial Block",
        },
      ]
    },

    // AIV report status
    "aiv" : {
      title: "Reported to AIV",
      menuItems: []
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
      menuItems: []
    },

    "ec": {
      title: "Edit count",
      menuItems: [
        {
          value: "100",
          label: "100+",
        },
        {
          value: "500",
          label: "500+",
        },
        {
          value: "1000",
          label: "1000+",
        },
        {
          value: "5000",
          label: "5000+",
        },
        {
          value: "10000",
          label: "10,000+",
        },
      ]
    }
};

export default UserFilters;