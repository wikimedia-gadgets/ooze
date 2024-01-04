// When connection made, every 5 seconds send a message to all ports.
addEventListener("connect", (event) => {
    const port = event.ports[0];
    console.log(port);
    port.start();
    port.postMessage("Hello from the shared worker!");
    setInterval(() => {
        port.postMessage("Hello from the shared worker!");
    }, 5000);
});