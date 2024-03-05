// We define this in code - there are numerous issues retrieving this from the API
// Original source and licence: https://en.wikipedia.org/wiki/Wikipedia:Ultraviolet/configuration.json
// And https://gitlab.wikimedia.org/repos/10nm/ultraviolet/-/blob/dev/src/mediawiki/warn/Warnings.ts
// Copyright Ultraviolet contributors

import exp from "constants";

type WarningFieldVisibility = "required" | "disabled" | "optional";

interface Warnings {
    categories: Record<string, { label: string }>;
    warnings: Record<string, {
        name: string;
        template: string;
        note?: string;
        keywords?: string[];
        category: string;
        type: "tiered" | "single" | "policy";
        levels?: (1 | 2 | 3 | 4 | 5)[];
    
        relatedPage?:
            | WarningFieldVisibility
            | {
                  visibility?: WarningFieldVisibility;
                  label?: string;
                  recentPages?: boolean;
              };
        additionalText?:
            | WarningFieldVisibility
            | {
                  visibility?: WarningFieldVisibility;
                  label?: string;
              };
    }
    >
}

const enwikiWarnings: Warnings = {
    "categories": {
        "common": {
            "label": "Common warnings"
        },
        "article": {
            "label": "Article conduct warnings"
        },
        "spam": {
            "label": "Promotions, spam, and point of view"
        },
        "editors": {
            "label": "Behavior towards other editors"
        },
        "remove": {
            "label": "Removal of deletion tags"
        },
        "other": {
            "label": "Other"
        },
        "remind": {
            "label": "Reminders"
        },
        "policy": {
            "label": "Policy violation warnings"
        }
    },
    "warnings": {
        "vandalism": {
            "name": "Vandalism",
            "category": "common",
            "template": "uw-vandalism",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ],
        },
        "disruptive": {
            "name": "Disruptive editing",
            "category": "common",
            "template": "uw-disruptive",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ],
        },
        "test": {
            "name": "Editing tests",
            "category": "common",
            "template": "uw-test",
            "type": "tiered",
            "levels": [
                1,
                2,
                3
            ]
        },
        "delete": {
            "name": "Removal of content, blanking",
            "category": "common",
            "template": "uw-delete",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "generic": {
            "name": "Generic warning (for template series missing level 4)",
            "category": "common",
            "template": "uw-generic",
            "type": "tiered",
            "levels": [
                4
            ]
        },
        "biog": {
            "name": "Adding unreferenced information about living persons",
            "category": "article",
            "template": "uw-biog",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "error": {
            "name": "Introducing deliberate factual errors",
            "category": "article",
            "template": "uw-error",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "genre": {
            "name": "Frequent genre changes without consensus or sources",
            "category": "article",
            "template": "uw-genre",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "image": {
            "name": "Image-related vandalism",
            "category": "article",
            "template": "uw-image",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "joke": {
            "name": "Using improper humor in articles",
            "category": "article",
            "template": "uw-joke",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "nor": {
            "name": "Adding original research, including unpublished syntheses of sources",
            "category": "article",
            "template": "uw-nor",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "notcensored": {
            "name": "Censorship or removal of objectionable material",
            "category": "article",
            "template": "uw-notcensored",
            "type": "tiered",
            "levels": [
                1,
                2,
                3
            ]
        },
        "own": {
            "name": "Ownership of articles",
            "category": "article",
            "template": "uw-own",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "tdel": {
            "name": "Removal of maintenance templates",
            "category": "article",
            "template": "uw-tdel",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "unsourced": {
            "name": "Addition of unsourced or improperly cited material",
            "category": "article",
            "template": "uw-unsourced",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "subtle": {
            "name": "Possible addition of subtle vandalism",
            "category": "article",
            "template": "uw-subtle",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "advert": {
            "name": "Using Wikipedia for advertising or promotion",
            "category": "spam",
            "template": "uw-advert",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "npov": {
            "name": "Not adhering to a neutral point of view",
            "category": "spam",
            "template": "uw-npov",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "fringe": {
            "name": "Addition of minority or fringe viewpoint bearing undue weight",
            "category": "spam",
            "template": "uw-fringe",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "paid": {
            "name": "Paid editing without disclosure",
            "category": "spam",
            "template": "uw-paid",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "spam": {
            "name": "Adding spam links",
            "category": "spam",
            "template": "uw-spam",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ],
        },
        "plotsum": {
            "name": "Addition of unnecessary plot details",
            "category": "spam",
            "template": "uw-plotsum",
            "type": "tiered",
            "levels": [
                1,
                2,
                3
            ]
        },
        "agf": {
            "name": "Not assuming good faith",
            "category": "editors",
            "template": "uw-agf",
            "type": "tiered",
            "levels": [
                1,
                2,
                3
            ]
        },
        "harass": {
            "name": "Harassment of other users",
            "category": "editors",
            "template": "uw-harass",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "npa": {
            "name": "Personal attacks directed at specific editors",
            "category": "editors",
            "template": "uw-npa",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "mislead": {
            "name": "Misleading edit summary",
            "category": "editors",
            "template": "uw-mislead",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "bes": {
            "name": "Uncivil or unconstructive edit summary",
            "category": "editors",
            "template": "uw-bes",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "tempabuse": {
            "name": "Improper use of warning or blocking template",
            "category": "editors",
            "template": "uw-tempabuse",
            "type": "tiered",
            "levels": [
                1,
                2
            ]
        },
        "afd": {
            "name": "Removing {{afd}} templates",
            "category": "remove",
            "template": "uw-afd",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "blpprod": {
            "name": "Removing {{blp prod}} templates",
            "category": "remove",
            "template": "uw-blpprod",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "idt": {
            "name": "Removing file deletion tags",
            "category": "remove",
            "template": "uw-idt",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "speedy": {
            "name": "Removing speedy deletion tags",
            "category": "remove",
            "template": "uw-speedy",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "ai": {
            "name": "LLM misuse",
            "category": "other",
            "template": "uw-ai",
            "type": "tiered",
            "levels": [
                1,
                2,
                3
            ]
        },
        "attempt": {
            "name": "Triggering an edit filter",
            "category": "other",
            "template": "uw-attempt",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "chat": {
            "name": "Using talk page as a forum",
            "category": "other",
            "template": "uw-chat",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "create": {
            "name": "Creating inappropriate pages",
            "category": "other",
            "template": "uw-create",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "mos": {
            "name": "Manual of Style related issues",
            "category": "other",
            "template": "uw-mos",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4
            ]
        },
        "move": {
            "name": "Page moves against naming conventions or consensus",
            "category": "other",
            "template": "uw-move",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "tpv": {
            "name": "Refactoring others' talk page comments",
            "category": "other",
            "template": "uw-tpv",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "upload": {
            "name": "Uploading unencyclopedic images",
            "category": "other",
            "template": "uw-upload",
            "type": "tiered",
            "levels": [
                1,
                2,
                3,
                4,
                5
            ]
        },
        "aiv": {
            "name": "Making bad AIV reports",
            "category": "remind",
            "template": "uw-aiv",
            "type": "single"
        },
        "autobiography": {
            "name": "Creating autobiographies",
            "category": "remind",
            "template": "uw-autobiography",
            "type": "single"
        },
        "badcat": {
            "name": "Adding incorrect categories",
            "category": "remind",
            "template": "uw-badcat",
            "type": "single"
        },
        "badlistentry": {
            "name": "Adding inappropriate entries to lists",
            "category": "remind",
            "template": "uw-badlistentry",
            "type": "single"
        },
        "bite": {
            "name": "Being harsh or biting the newcomers",
            "category": "remind",
            "template": "uw-bite",
            "type": "single"
        },
        "coi": {
            "name": "Violating the conflict of interest policy",
            "category": "remind",
            "template": "uw-coi",
            "type": "single"
        },
        "controversial": {
            "name": "Introducing controversial material",
            "category": "remind",
            "template": "uw-controversial",
            "type": "single"
        },
        "copying": {
            "name": "Copying text to another page without attribution",
            "category": "remind",
            "template": "uw-copying",
            "type": "single"
        },
        "unattribcc": {
            "name": "Copying Creative Commons licensed text without attribution",
            "category": "remind",
            "template": "uw-unattribcc",
            "type": "single"
        },
        "crystal": {
            "name": "Adding speculative or unconfirmed information",
            "category": "remind",
            "template": "uw-crystal",
            "type": "single"
        },
        "cpmove": {
            "name": "Cut and paste moves",
            "category": "remind",
            "template": "uw-c\u0026pmove",
            "type": "single"
        },
        "dab": {
            "name": "Incorrect edit to a disambiguation page",
            "category": "remind",
            "template": "uw-dab",
            "type": "single"
        },
        "date": {
            "name": "Unnecessarily changing date formats",
            "category": "remind",
            "template": "uw-date",
            "type": "single"
        },
        "deadlink": {
            "name": "Removing proper sources containing dead links",
            "category": "remind",
            "template": "uw-deadlink",
            "type": "single"
        },
        "draftfirst": {
            "name": "User should draft in draftspace or userspace",
            "category": "remind",
            "template": "uw-draftfirst",
            "type": "single"
        },
        "editsummary": {
            "name": "Not using edit comment",
            "category": "remind",
            "template": "uw-editsummary",
            "type": "single"
        },
        "elinbody": {
            "name": "Adding external links to the body of an article",
            "category": "remind",
            "template": "uw-elinbody",
            "type": "single"
        },
        "english": {
            "name": "Not communicating in English",
            "category": "remind",
            "template": "uw-english",
            "type": "single"
        },
        "hasty": {
            "name": "Hasty addition of speedy deletion tags",
            "category": "remind",
            "template": "uw-hasty",
            "type": "single"
        },
        "italicize": {
            "name": "Italicize books, films, albums, magazines, TV series, etc within articles",
            "category": "remind",
            "template": "uw-italicize",
            "type": "single"
        },
        "lang": {
            "name": "Unnecessarily changing between British and American English",
            "category": "remind",
            "template": "uw-lang",
            "type": "single"
        },
        "linking": {
            "name": "Excessive addition of redlinks or repeated blue links",
            "category": "remind",
            "template": "uw-linking",
            "type": "single"
        },
        "minor": {
            "name": "Incorrect use of minor edits check box",
            "category": "remind",
            "template": "uw-minor",
            "type": "single"
        },
        "notenglish": {
            "name": "Creating non-English articles",
            "category": "remind",
            "template": "uw-notenglish",
            "type": "single"
        },
        "notvote": {
            "name": "We use consensus, not voting",
            "category": "remind",
            "template": "uw-notvote",
            "type": "single"
        },
        "plagiarism": {
            "name": "Copying from public domain sources without attribution",
            "category": "remind",
            "template": "uw-plagiarism",
            "type": "single"
        },
        "preview": {
            "name": "Use preview button to avoid mistakes",
            "category": "remind",
            "template": "uw-preview",
            "type": "single"
        },
        "redlink": {
            "name": "Indiscriminate removal of redlinks",
            "category": "remind",
            "template": "uw-redlink",
            "type": "single"
        },
        "selfrevert": {
            "name": "Reverting self tests",
            "category": "remind",
            "template": "uw-selfrevert",
            "type": "single"
        },
        "socialnetwork": {
            "name": "Wikipedia is not a social network",
            "category": "remind",
            "template": "uw-socialnetwork",
            "type": "single"
        },
        "sofixit": {
            "name": "Be bold and fix things yourself",
            "category": "remind",
            "template": "uw-sofixit",
            "type": "single"
        },
        "spoiler": {
            "name": "Adding spoiler alerts or removing spoilers from appropriate sections",
            "category": "remind",
            "template": "uw-spoiler",
            "type": "single"
        },
        "talkinarticle": {
            "name": "Talk in article",
            "category": "remind",
            "template": "uw-talkinarticle",
            "type": "single"
        },
        "tilde": {
            "name": "Not signing posts",
            "category": "remind",
            "template": "uw-tilde",
            "type": "single"
        },
        "toppost": {
            "name": "Posting at the top of talk pages",
            "category": "remind",
            "template": "uw-toppost",
            "type": "single"
        },
        "userspaceDraftFinish": {
            "name": "Stale userspace draft",
            "category": "remind",
            "template": "uw-userspace draft finish",
            "type": "single"
        },
        "vgscope": {
            "name": "Adding video game walkthroughs, cheats or instructions",
            "category": "remind",
            "template": "uw-vgscope",
            "type": "single"
        },
        "warn": {
            "name": "Place user warning templates when reverting vandalism",
            "category": "remind",
            "template": "uw-warn",
            "type": "single"
        },
        "wrongsummary": {
            "name": "Using inaccurate or inappropriate edit summaries",
            "category": "remind",
            "template": "uw-wrongsummary",
            "type": "single"
        },
        "3rr": {
            "name": "Potential three-revert rule violation",
            "category": "policy",
            "template": "uw-3rr",
            "type": "policy"
        },
        "affiliate": {
            "name": "Affiliate marketing",
            "category": "policy",
            "template": "uw-affiliate",
            "type": "policy"
        },
        "agfsock": {
            "name": "Use of multiple accounts (assuming good faith)",
            "category": "policy",
            "template": "uw-agf-sock",
            "type": "policy",
            "relatedPage": {
                "label": "Suspected sock username",
                "recentPages": false
            }
        },
        "attack": {
            "name": "Creating attack pages",
            "category": "policy",
            "template": "uw-attack",
            "type": "policy"
        },
        "botun": {
            "name": "Bot username",
            "category": "policy",
            "template": "uw-botun",
            "type": "policy",
            "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
        },
        "canvass": {
            "name": "Canvassing",
            "category": "policy",
            "template": "uw-canvass",
            "type": "policy"
        },
        "copyright": {
            "name": "Copyright violation",
            "category": "policy",
            "template": "uw-copyright",
            "type": "policy"
        },
        "copyrightlink": {
            "name": "Linking to copyrighted works violation",
            "category": "policy",
            "template": "uw-copyright-link",
            "type": "policy"
        },
        "copyrightnew": {
            "name": "Copyright violation (with explanation for new users)",
            "category": "policy",
            "template": "uw-copyright-new",
            "type": "single"
        },
        "copyrightremove": {
            "name": "Removing {{copyvio}} template from articles",
            "category": "policy",
            "template": "uw-copyright-remove",
            "type": "policy"
        },
        "efsummary": {
            "name": "Edit comment triggering the edit filter",
            "category": "policy",
            "template": "uw-efsummary",
            "type": "policy"
        },
        "ew": {
            "name": "Edit warring (Warning)",
            "category": "policy",
            "template": "uw-ew",
            "type": "policy",
        },
        "ewsoft": {
            "name": "Edit warring (Notice for new editors)",
            "category": "policy",
            "template": "uw-ewsoft",
            "type": "policy",
        },
        "hijacking": {
            "name": "Hijacking articles",
            "category": "policy",
            "template": "uw-hijacking",
            "type": "policy"
        },
        "hoax": {
            "name": "Creating hoaxes",
            "category": "policy",
            "template": "uw-hoax",
            "type": "policy"
        },
        "legal": {
            "name": "Making legal threats",
            "category": "policy",
            "template": "uw-legal",
            "type": "policy"
        },
        "login": {
            "name": "Editing while logged out",
            "category": "policy",
            "template": "uw-login",
            "type": "policy"
        },
        "multipleIPs": {
            "name": "Usage of multiple IPs",
            "category": "policy",
            "template": "uw-multipleIPs",
            "type": "policy"
        },
        "pinfo": {
            "name": "Personal info",
            "category": "policy",
            "template": "uw-pinfo",
            "type": "policy"
        },
        "salt": {
            "name": "Recreating salted articles under a different title",
            "category": "policy",
            "template": "uw-salt",
            "type": "policy"
        },
        "socksuspect": {
            "name": "Sockpuppetry",
            "category": "policy",
            "template": "uw-socksuspect",
            "type": "policy"
        },
        "upv": {
            "name": "Userpage vandalism",
            "category": "policy",
            "template": "uw-upv",
            "type": "policy"
        },
        "username": {
            "name": "Username may be against policy",
            "category": "policy",
            "template": "uw-username",
            "type": "policy",
            "note": "Username notices should not be added for blatant violations. In these cases, report the account to Usernames for administrator attention.",
            "keywords": [
                "uaa"
            ],
            "relatedPage": {
                "visibility": "required",
                "label": "Reason",
                "recentPages": false
            }
        },
        "coiusername": {
            "name": "Username may be against policy, and conflict of interest",
            "category": "policy",
            "template": "uw-coi-username",
            "type": "policy",
            "note": "Username notices should not be added for blatant violations. In these cases, report the account to Usernames for administrator attention."
        },
        "userpage": {
            "name": "Userpage or subpage is against policy",
            "category": "policy",
            "template": "uw-userpage",
            "type": "policy",
            "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
        }
    },
};

export default enwikiWarnings;