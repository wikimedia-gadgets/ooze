const initTime = Date.now();
interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}

const _self: SharedWorkerGlobalScope = self as any;

const activePorts: MessagePort[] = [];

// keep list of active ooze. we want to make our proxied requests ideally through the focused ooze client
interface OozeClient {
    id: string;
    port?: MessagePort;
    lastActive: number;
}


// When connection made, every 5 seconds send a message to all ports.
_self.onconnect = e => {
    const port = e.ports[0];
    port.start();
    activePorts.push(port);

    // On disconnect, remove port from activePorts
    port.addEventListener
    port.postMessage("[oozeWorker] started");
    setInterval(() => {
        port.postMessage("[oozeWorker] was started at: " + initTime);
    }, 5000);
};