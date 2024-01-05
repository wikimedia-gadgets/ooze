import WorkerFunctionHandler from "./WorkerFunctionHandler";
import Heartbeat from "./functions/Heartbeat";
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const initTime = Date.now();
interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}

const _self: SharedWorkerGlobalScope = self as any;

// keep list of active ooze. we want to make our proxied requests ideally through the focused ooze client
interface OozeClient {
    id: string;
    lastActive: number;
    inFocus: boolean;
}

// Todo: Put this in database, so we can access clients from async threads
// Here things can get out of sync
const clients: Map<string, OozeClient> = new Map(); // key is client id

// Initialize the worker function handler
const wfh = new WorkerFunctionHandler({
    "heartbeat": Heartbeat,
});

// Initialize sqlite3
async function initSqlite3() {
    let db: any;

    // Initialize sqlite3 wasm module
    const sqlite3 = await sqlite3InitModule({
        print: console.log,
        printErr: console.error,
    });

    // Create a new database. If opfs is not available an in-memory database will be created
    // if this happens, we need to warn the user that their data will not be saved

    try {
        const poolUtil = await sqlite3.installOpfsSAHPoolVfs({});
        db = new poolUtil.OpfsSAHPoolDb('/ooze');
        console.log('OPFS is available, created persisted database at', db.filename);
    } catch (error) {
        // Todo, send message to client to warn database load failed
        console.error('OPFS is not available.', error);
    }

};

// Initialize sqlite3
initSqlite3();



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

        // If the client is not in the list, add it
        if (!clients.has(clientId)) {
            clients.set(clientId, {
                id: clientId,
                lastActive: Date.now(),
                inFocus: false, // We don't assume the client is in focus, we wait for it to tell us.
            });
            console.log(`Connected clients: ${clients.size}`)
        } else {
            // Update the last active time
            (clients.get(clientId) as OozeClient).lastActive = Date.now();
        }


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