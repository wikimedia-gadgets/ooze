/*
Gets the wikitext for a user warning
used for both warning and the preview
*/

export default async function GetUserWarningWikiText(
    username: string,
    template: string,
    level: 0 | 1 | 2 | 3 | 4 | 5 | null, // Level 0 is auto, null is where template is not applicable
    relatedPage: string,
    additionalComment?: string,
    existingWarningLevel?: string,
) {
    console.log("[GetUserWarningWikiText] Get warning for", username, template, level, relatedPage);
    return "";
}