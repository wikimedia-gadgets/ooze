// Handles incoming worker messages from the client
// This gets called when a message sent to the worker is received with "bridgeIdentifier"
// and "taskID" properties in the data object

export default class WorkerFunctionHandler {
    private handlers: Record<string, (...args: any[]) => Promise<any>> = {};

    constructor(handlers: Record<string, (...args: any[]) => Promise<any>>) {
        this.handlers = handlers;
    }

    public async handleData(data: any): Promise<any> {
        const { bridgeIdentifier, taskID, args } = data;
        if (!this.handlers[bridgeIdentifier]) {
            throw new Error(`No handler found for ${bridgeIdentifier}`);
        }

        const handler = this.handlers[bridgeIdentifier];

        try {
            const result = await handler(...args);
            return { taskID, result };
        } catch (error) {
            return { taskID, error };
        }
    }
}