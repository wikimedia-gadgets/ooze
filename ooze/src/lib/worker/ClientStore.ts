interface OozeClient {
    id: string;
    lastActive: number;
    inFocus: boolean;
    port?: MessagePort;
}

export default class ClientStore {
    static _: ClientStore;

    // Key is the client ID
    private clients: Map<string, OozeClient> = new Map();

    constructor() {
        ClientStore._ = this;

        // Every 450ms, purge inactive clients
        setInterval(this.purgeInactiveClients.bind(this), 450);
    }

    public purgeInactiveClients() {
        // Purge any clients that have not responded in 500ms (heartbeat happens every 250ms)
        const now = Date.now();
        for (const [id, client] of this.clients) {
            if (now - client.lastActive > 500) {
                console.log(`Purging client ${id}, stale for ${now - client.lastActive}ms.`);
                this.clients.delete(id);
            }
        }
    }

    public registerClient(clientId: string, port: MessagePort) {

        if (this.clients.has(clientId)) {
            // Update the last active time
            (this.clients.get(clientId) as OozeClient).lastActive = Date.now();
            // Update the port
            (this.clients.get(clientId) as OozeClient).port = port;
            return;
        }

        // We don't automatically assume focus
        this.clients.set(clientId, {
            id: clientId,
            lastActive: Date.now(),
            inFocus: false,
            port,
        });
    }

    // Optimal client ID is the client that has been active most recently (and in focus todo)
    public async getOptimalClientID(retryCount?: number): Promise<string> {
        let optimalClient: OozeClient | null = null;
        for (const client of this.clients.values()) {
            if (!optimalClient || client.lastActive > optimalClient.lastActive) {
                optimalClient = client;
            }
        }

        // If optimal client is null, we have no clients. Wait 100ms * retryCount and try again.
        // We do this forever until focus is restored to a client.
        if (!optimalClient) {
            console.log(`No clients available, retrying... (${retryCount ?? 1})`);
            if (!retryCount) retryCount = 1;
            // If retryCount is > 20, we should reset the count to 1
            if (retryCount > 20) retryCount = 1;
            await new Promise(resolve => setTimeout(resolve, 100 * (retryCount ?? 1)));
            return await this.getOptimalClientID(retryCount + 1);
        }

        return optimalClient.id;
    }

    public async sendMessageToClient(clientId: string, message: any) {
        const client = this.clients.get(clientId);
        if (!client) {
            console.error(`Client ${clientId} not found.`);
            return;
        }

        if (!client.port) {
            console.error(`Client ${clientId} does not have a port.`);
            return;
        }

        client.port.postMessage({
            ...message,
            clientId,
        });
    }
}