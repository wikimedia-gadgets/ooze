// Allows requests to be made with same origin and cookies by using the client's fetch function.
// Todo: Consolidate some of this with the MediaWikiProxy

import ClientStore from "../ClientStore";

export default class ClientFetch {
    // Current instance of the client fetch
    static _: ClientFetch;
    private waitingTasks: Record<string, (data: any) => void> = {};

    constructor() {
        ClientFetch._ = this;
    }

    // No need for anything too fancy, this does the job
    public async cFetchJson(url: string, options: RequestInit = {}): Promise<Record<any, any>> {
        // Send request to active client
        // Get the optimal client ID
        const clientID = await ClientStore._?.getOptimalClientID();

        // Generate a task ID
        const taskID = crypto.randomUUID();
        const promise = new Promise<any>((resolve, reject) => {
            // Add to our waiting tasks
            // Todo: handle reject
            this.waitingTasks[taskID] = resolve;
        });

        // Send to client
        ClientStore._?.sendMessageToClient(clientID, {
            clientFetchJsonUrl: url,
            clientFetchJsonOptions: options,
            workerTaskID: taskID,
        });

        // Wait for client response
        const data = await promise;

        // Return response
        return data.clientFetchJsonResult;
    }

    // Handle response from client
    public handleResponse(response: any) {
        // Resolve the promise
        this.waitingTasks[response.workerTaskID](response);
    }
}