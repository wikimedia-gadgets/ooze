
// Initializes OOUI and its dependencies on MediaWiki.
// Returns true if successful, false otherwise.
// Lots of this isn't type checked - this is intentional as this uses a lot of MediaWiki internals.
export default async function initOOUI(): Promise<boolean> {
    // If OOUI is already loaded, we don't need to do anything.
    if (window.OO && window.OO.ui) {
        return true;
    }

    try {
        await mw.loader.using("oojs-ui-core");
        await mw.loader.using("oojs-ui-windows");
        await mw.loader.using("oojs-ui-widgets");
        
        if (!window.OO || !window.OO.ui) {
            throw new Error("OOUI not loaded");
        }
        return true;
    } catch (error) {
        console.error("Error loading OOUI: ", error);
        return false;
    }
}