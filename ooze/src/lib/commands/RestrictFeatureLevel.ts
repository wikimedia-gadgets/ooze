// Client only
// Returns TRUE if user is not in the required group

export default function RestrictFeatureLevel(haveOneOfThesePerms: string[], notify = true): boolean {

    // If the user has the required permission, return true. We use an array as confirmed requires check of confirmed and autoconfirmed
    if (mw.config.get("wgUserGroups").some((perm: string) => haveOneOfThesePerms.includes(perm))) return false;


    if (notify) mw.notify(`Whoops! Looks like you've found a feature that is restricted.
    Please try again when you have this permission: ${JSON.stringify(haveOneOfThesePerms)}`, {
        title: "Restricted feature",
        type: "warn",
    });

    return true;
}

export class CanUseOoze {
    
    public DemoModeEnabled: boolean;

    static _: CanUseOoze;
    
    constructor() {
        // Set to true if the user is not in the required group
        this.DemoModeEnabled = RestrictFeatureLevel(["confirmed", "autoconfirmed", "sysop"], false);
        CanUseOoze._ = this;
    }

}