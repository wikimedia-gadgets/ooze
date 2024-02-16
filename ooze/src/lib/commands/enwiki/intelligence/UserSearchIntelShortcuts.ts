/*
.me - current user
.e - last editor of this page
.p - default last editor of previous page visited
.e [page name] [user filter] - last editor of page (in quotes if spaces)
.p [page name] [user filter]  - last editor of given page (in quotes if spaces)
.b - last editor I blocked
.rp - last editor I reported
.r - last editor I reverted the edit of
.u - last userpage I visited (talk or not)
*/

export interface UserSearchIntelShortcut {
    shortcut: string;
    description: string;
}

const UserSearchIntelShortcuts: Record<string, UserSearchIntelShortcut> = {
    'me': {
        shortcut: '.me',
        description: 'Your username',
    },

    'e': {
        shortcut: '.e',
        description: 'Last editor of this page',
    },

    'p': {
        shortcut: '.p',
        description: 'Last editor of previous page visited (other than yourself)',
    },

    'e advanced': {
        shortcut: '.e [page name] [user filter]',
        description: 'Last editor of page (in quotes if spaces)',
    },

    'p advanced':{
        shortcut: '.p [page name] [user filter]',
        description: 'Last editor of given page (in quotes if spaces)',
    },

    'b': {
        shortcut: '.b',
        description: 'Last editor I blocked',
    },

    'rp': {
        shortcut: '.rp',
        description: 'Last editor I reported',
    },

    'r': {
        shortcut: '.r',
        description: 'Last editor I reverted the edit of',
    },

    'u': {
        shortcut: '.u',
        description: 'Last user page',
    }
};

export default UserSearchIntelShortcuts;