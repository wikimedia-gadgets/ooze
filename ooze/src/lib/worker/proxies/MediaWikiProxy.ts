// The MediaWiki proxy provides a near enough standard mw object, but allows it to be used in a worker.
// We send the request to the active client, then the client sends the response to the worker.

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

class MediaWikiProxy {
    constructor() {

    }

    // I tried some more complex typing here but it just got crazy
    // Instead just do typeof mw.blah.blah when calling
    // If T is a promise, the client will await the result before returning
    public async mwp<T extends (...args: any[]) => any> (
        commands: string[],
        ...args: T extends (...args: infer Params) => any ? Params : never
    ): Promise<UnwrapPromise<ReturnType<T>>> {
        // Send request to active client

        // Run under mw




        // Return response - placeholder
        return {} as UnwrapPromise<ReturnType<T>>;
    }
}

// Example for mw.notify

async () => {
    const mwThing = new MediaWikiProxy();
    const x = await mwThing.mwp<typeof mw.notify>(["notify"], "Hello world");
};
