export default async function WarnUser(
    target: string,
    // Level 0 is auto, null is where template is not applicable
    level: 0 | 1 | 2 | 3 | 4 | 5 | null,
    template: string,
    relatedPage: string,
) {
    console.log("[WarnUser] Warn user", target, level, template);
}