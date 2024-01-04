import oozeWorker from "./oozeWorker?sharedworker";

const oozeVer = APP_VERSION;

// Entry for worker iframe
console.log(`OOZE ${oozeVer} worker iframe loaded.`);

// Create a new worker
const worker = new oozeWorker();

// Listen for messages from the worker
worker.port.addEventListener("message", (event) => {
    console.log(`Message from worker: ${event.data}`);
});

worker.onerror = (e) => {
    console.error(`Error from worker: ${e}`);
};

worker.port.start();