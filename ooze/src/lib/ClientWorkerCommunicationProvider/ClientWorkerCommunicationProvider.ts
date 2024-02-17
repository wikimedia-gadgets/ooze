// The client worker communication provider is a class that allows communication between the client and the worker.
// Due to cross-origin limitations, communication is done via the oozeFrame iframe.
// This allows us to still have a shared worker, but also allows us to communicate with the client.

export default class ClientWorkerCommunicationProvider {
    private oozeFrame: HTMLIFrameElement;
    private oozeID: string;

    private pendingTasks: Record<string, {
        resolve: (value: any) => void,
        reject: (reason?: any) => void,
    }> = {};

    // The current instance of the client worker communication provider
    static _: ClientWorkerCommunicationProvider;

    // Constructor must take the iframe element
    constructor(iframe: HTMLIFrameElement) {
        this.oozeFrame = iframe;

        // This is the ID of this ooze instance.
        // If we get a message from the worker with a different ID, we ignore it.
        this.oozeID = crypto.randomUUID();

        // Add handler for when the #oozeFrame iframe posts a message
        window.addEventListener('message', this.handleWorkerMessage.bind(this));

        ClientWorkerCommunicationProvider._ = this;
    }

    public sendToWorker(data: any) {
        if (!this.oozeFrame?.contentWindow) throw new Error('oozeFrame not found or loaded. Cannot continue.');

        // Send message to worker
        this.oozeFrame.contentWindow.postMessage({
            type: 'oozeClient',
            data: {
                clientId: this.oozeID,
                ...data,
            }
        }, '*');
    }

    private handleWorkerMessage(e: MessageEvent) {
        if (e.data.type !== 'oozeWorker') return;
        if (e.data.data.clientId !== this.oozeID) return;

        if (e.data.data.taskID) {
            const { taskID, result, error } = e.data.data;
            if (error) {
                this.pendingTasks[taskID].reject(error);
            } else {
                this.pendingTasks[taskID].resolve(result);
            }
        }
    }

    // This is more than likely the most common way of communicating with the worker.
    // You can import *TYPES* from the worker into the client and use them here to preserve type safety.
    // The message will be sent to the worker, and the worker will send a response back.
    // The bridge identifier identifies the function to call in the worker.
    public workerFunction<T extends (...args: any[]) => any>(bridgeIdentifier: string, ...args: Parameters<T>): Promise<ReturnType<T>> {
        // Generate a task ID
        const taskID = crypto.randomUUID();
        const promise = new Promise<ReturnType<T>>((resolve, reject) => {
            // Add to our pending tasks
            this.pendingTasks[taskID] = {
                resolve,
                reject,
            };
        });

        // Send message to worker
        this.sendToWorker({
            taskID,
            bridgeIdentifier,
            args,
        });

        return promise;
    }
};