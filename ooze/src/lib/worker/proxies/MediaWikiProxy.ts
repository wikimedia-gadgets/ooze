// The MediaWiki proxy provides a near enough standard mw object, but allows it to be used in a worker.
// We send the request to the active client, then the client sends the response to the worker.

import ClientStore from "../ClientStore";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export default class MediaWikiProxy {
    static _: MediaWikiProxy;

    private waitingTasks: Record<string, (data: any) => void> = {};

    constructor() {
        MediaWikiProxy._ = this;
    }

    // Use mwf to call a mw function and get the result. This runs asynchronously.
    // The type you pass should be the type of the mw function you are calling.
    // The first argument is an array of where the function is located in the mw object,
    // for example mw.loader.load would be ["loader", "load"].
    // The rest of the arguments are the arguments for the function, inferred from the type.
    public async mwf<T extends (...args: any[]) => any> (
        commands: string[],
        ...args: T extends (...args: infer Params) => any ? Params : never
    ): Promise<UnwrapPromise<ReturnType<T>>> {
        // Send request to active client

        // Todo: Run under mw

        // Get the optimal client ID
        const clientID = await ClientStore._?.getOptimalClientID();

        // Generate a task ID
        const taskID = crypto.randomUUID();
        const promise = new Promise<any>((resolve, reject) => {
            // Add to our waiting tasks
            this.waitingTasks[taskID] = resolve;
        });

        // Send to client
        ClientStore._?.sendMessageToClient(clientID, {
            mwFunction: commands,
            mwArgs: args,
            workerTaskID: taskID,
        });

        // Wait for client response
        const data = await promise;

        console.log(data);

        // Return response - placeholder
        return {} as UnwrapPromise<ReturnType<T>>;
    }

    // Use mwv to get the value of a mw variable. This runs asynchronously too.
    // In many cases, it may be far more effective to just query the SQLite database directly.
    // The type you pass should be the type of the mw variable you are getting.
    // The only argument is an array of where the variable is located in the mw object,
    // for example mw.config.value would be ["config", "value"].
    public async mwv<T> (commands: string[]): Promise<T> {
        // Send request to active client

        // Todo: Run under mw

        // Return response - placeholder
        return {} as T;
    }

    // Handle response from client
    public handleResponse (response: any) {
        // If the response has a workerTaskID and it's in our waiting tasks, resolve it
        if (response.workerTaskID && Object.keys(this.waitingTasks).includes(response.workerTaskID)) {
            // This is Promise.resolve
            this.waitingTasks[response.workerTaskID](response);
        }
    }
}
