// Initializes OOUI and its dependencies on MediaWiki.
// Returns true if successful, false otherwise.
// Lots of this isn't type checked - this is intentional as this uses a lot of MediaWiki internals.
export default function initOOUI(): Promise<boolean> {
    // Create a promise that resolves when OOUI is loaded.
    return new Promise<boolean>((resolve, reject) => {
        // If OOUI is already loaded, resolve the promise.
        if (window.OO && window.OO.ui) {
            resolve(true);
        }

        try {
            mw.loader.using( 'oojs-ui-core' ).done(() =>
                resolve(window.OO != null && window.OO.ui != null)
            );
        } catch (error) {
            console.error("Error loading OOUI: ", error);
        }
    });
}