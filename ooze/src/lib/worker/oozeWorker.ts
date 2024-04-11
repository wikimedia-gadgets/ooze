import ClientStore from "./ClientStore";
import WorkerFunctionHandler from "./WorkerFunctionHandler";
import OozeDb from "./db/DbConnection";
import Heartbeat from "./functions/Heartbeat";
import BasicSearch from "./functions/enwiki/BasicSearch";
import CheckIfReportedToAIV from "./functions/enwiki/CheckIfReportedToAIV";
import GetUserRevIDs from "./functions/enwiki/GetUserRevIDs";
import GetUserWarningLevel from "./functions/enwiki/GetUserWarningLevel";
import LastEditorsOnPage from "./functions/enwiki/LastEditorsOnPage";
import LiftWingInsights from "./functions/enwiki/LiftWingInsights";
import RegisterPageVisit from "./functions/RegisterPageVisit";
import UsersSearch from "./functions/enwiki/UsersSearch";
import ClientFetch from "./proxies/ClientFetch";
import MediaWikiProxy from "./proxies/MediaWikiProxy";
import GetPageVisitHistory from "./functions/PageVisitHistory";
import ExportSqlDb from "./functions/ExportSqliteDb";
import GetStorageAvailToOozeWorker from "./functions/GetStorageAvailToOozeWorker";
import WorkerFunctions from "./functions/WorkerFunctions";

console.log("[oozeWorker] Ooze worker loaded [sharedworker]");

interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}

const _self: SharedWorkerGlobalScope = self as any;

// keep list of active ooze. we want to make our proxied requests ideally through the focused ooze client
new ClientStore();

// Create our MediaWiki proxy. We can refer to this using the _ property
new MediaWikiProxy();

// Create our ClientFetch proxy. We can refer to this using the _ property
new ClientFetch();

// Initialize the worker function handler
const wfh = new WorkerFunctionHandler(WorkerFunctions);

(async () => {
    try {
        // Initialize DB
        await (new OozeDb()).setGlobalConnection();
    } catch (error) {
        // Failed to initialize DB
        console.error("Failed to initialize DB", error);
    }
})();

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
        ClientStore._?.registerClient(clientId, port);


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

        // If data includes a "workerTaskID" and "mwFunction", it's a result of a MediaWiki function,
        // and should be passed back to the MediaWikiProxy
        if (data.workerTaskID && data.mwFunction) {
            MediaWikiProxy._?.handleResponse(data);
            return;
        }

        // If data includes a "workerTaskID" and "clientFetchJsonResult", it's a result of a fetch request,
        // and should be passed back to the ClientFetch Proxy
        if (data.workerTaskID && data.clientFetchJsonResult) {
            // console.log("Handling client fetch response", data);
            ClientFetch._?.handleResponse(data);
            return;
        }

        console.warn("[oozeWorker] Unhandled message from client", data);
    });
};