 const oozeVer = APP_VERSION;

// When worker is initialised, send a message to the main thread
self.addEventListener('connect', e => {

    const port = e.ports[0];
    port.postMessage(`OOZE ${oozeVer} worker initialised.`);
    port.start();

    // Send a message to the main thread every 5 seconds
    setInterval(() => {
        port.postMessage(`OOZE ${oozeVer} worker is running.`);
    }, 5000);
});