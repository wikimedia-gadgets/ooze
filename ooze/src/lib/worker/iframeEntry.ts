import oozeWorker from "./oozeWorker?sharedworker";

const oozeVer = APP_VERSION;

// Entry for worker iframe
console.log(`OOZEworker v${oozeVer} - copyright 2024 Ed Englefield`);

// Create a new worker
const worker = new oozeWorker();

// Listen for messages from the worker
// Send this worker message to the main page
worker.port.addEventListener("message", e => {
    parent.postMessage({
        type: "oozeWorker",
        data: e.data,
    }, "*");
});

worker.onerror = (e) => {
    console.error(`Error from worker: ${e}`);
};

worker.port.start();


// When message received from main page with type "oozeClient", send it to the worker

window.addEventListener("message", e => {
    if (e.data.type === "oozeClient") {
        console.log(e.data);
        worker.port.postMessage(e.data.data);
    }
});