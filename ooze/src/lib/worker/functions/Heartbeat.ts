// Register a client with the worker and/or update the client's last active time.

export default async function Heartbeat(): Promise<true> {
    // This is done automatically when a message is received from the client.
    // This is here as a sanity check to verify that the client is able to communicate with the worker.
    return true;
}