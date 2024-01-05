import WorkerFunctionHandler from "./WorkerFunctionHandler";

const initTime = Date.now();
interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}

const _self: SharedWorkerGlobalScope = self as any;

// keep list of active ooze. we want to make our proxied requests ideally through the focused ooze client
interface OozeClient {
    id: string;
    port?: MessagePort;
    lastActive: number;
}

// Initialize the worker function handler
const wfh = new WorkerFunctionHandler({
    "ping": async (extraBody: string) => `pong ${extraBody}`,
});


// When connection made, every 5 seconds send a message to all ports.
_self.onconnect = e => {
    const port = e.ports[0];
    port.start();

    // When a message is received from a client, handle it accordingly
    port.addEventListener("message", async e => {
        // The iframe handler removes the type property from the message before sending it to the worker
        const { data } = e;

        // All data packets must contain a clientId - if not, ignore
        const { clientId } = data;
        if (!clientId) {
            return;
        }

        // If the client is not in the list, add it (todo)

        // If data includes taskID and bridgeIdentifier, it's a request to a worker function
        // and should be handled accordingly
        if (data.taskID && data.bridgeIdentifier) {
            const result = await wfh.handleData(data);
            // We only need to pass back the data. The iframe handler will add the type property
            port.postMessage({
                ...result,
                clientId,
            });
            return;
        }
    });
};