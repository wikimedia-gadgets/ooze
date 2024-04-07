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

    // Incoming message from the worker
    // This could be a response to a task we sent to the worker, or it could be a message from the worker
    // for example - the worker might want us to run a mw function

    private async handleWorkerMessage(e: MessageEvent) {
        // Todo: Take these out into their own files
        if (e.data.type !== 'oozeWorker') return;
        if (e.data.data.clientId !== this.oozeID) return;

        if (e.data.data.taskID) {
            const { taskID, result, error } = e.data.data;
            if (error) {
                this.pendingTasks[taskID].reject(error);
            } else {
                this.pendingTasks[taskID].resolve(result);
            }

            return;
        }

        // MediaWiki function request
        // Worker must also send a taskID
        if (e.data.data.mwFunction && e.data.data.workerTaskID) {
            // See MediaWikiProxy.ts in the worker - mwFunction is a string array like ["config", "get"]
            // mwArgs is the arguments for the function
            // console.log('MediaWiki function request', e.data.data.mwFunction, e.data.data.mwArgs);
            const mwFunction: string[] = e.data.data.mwFunction;
            const mwArgs: any[] = e.data.data.mwArgs;

            // Run the function in mw
            // @ts-ignore
            const functionToRun = mwFunction.reduce((obj, key) => obj[key], mw) as (...args: any[]) => any;

            // This context needs to be the parent object of the function - we do this by popping the last key off the array
            // and using that as the context
            mwFunction.pop();

            // @ts-ignore
            const functionContext = mwFunction.reduce((obj, key) => obj[key], mw);

        
            const result = functionToRun.apply(functionContext, mwArgs);


            // If the result has a "then" property, it's a promise, and we should await it
            if (result?.then) {
                // console.log('Promise detected');
                result.then((resolved: any) => {
                    this.sendToWorker({
                        taskID: e.data.data.workerTaskID,
                        result: resolved,
                    });
                });

                // Todo: Handle rejections

                return;
            }

            // console.log('Result', result);

            this.sendToWorker({
                mwFunction: e.data.data.mwFunction,
                workerTaskID: e.data.data.workerTaskID,
                result,
            });

            return;
        }

        // Client fetch request
        if (e.data.data.clientFetchJsonUrl && e.data.data.workerTaskID) {
            // console.log('Client fetch request', e.data.data.clientFetchJsonUrl, e.data.data.clientFetchJsonOptions);
            // Fetch the data
            const fetchR = await fetch(e.data.data.clientFetchJsonUrl, e.data.data.clientFetchJsonOptions);

            const json = await fetchR.json();

            this.sendToWorker({
                workerTaskID: e.data.data.workerTaskID,
                clientFetchJsonResult: json,
                ok: fetchR.ok,
                status: fetchR.status,
            });
            return;
        }

        console.warn('Unhandled message from worker', e.data.data);
    }

    // This is more than likely the most common way of communicating with the worker.
    // You can import *TYPES* from the worker into the client and use them here to preserve type safety.
    // The message will be sent to the worker, and the worker will send a response back.
    // The bridge identifier identifies the function to call in the worker.
    public workerFunction<T extends (...args: any[]) => any>(bridgeIdentifier: string, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
        // Generate a task ID
        const taskID = crypto.randomUUID();
        const promise = new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
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