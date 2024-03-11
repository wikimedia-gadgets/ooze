import './app.css'
import App from './App.svelte'
import ClientWorkerCommunicationProvider from './lib/ClientWorkerCommunicationProvider/ClientWorkerCommunicationProvider';
import type Heartbeat from './lib/worker/functions/Heartbeat';

import { CanUseOoze } from "./lib/commands/RestrictFeatureLevel";

// Perms, for use globally
new CanUseOoze();

// Add ooze to the DOM
// Create ooze div
const ooze = document.createElement('div');
ooze.id = 'ooze';
document.body.appendChild(ooze);

// Generate an ID for this ooze instance
const oozeID = crypto.randomUUID();

// As we pretty much do all our work in promises, we should catch any unhandled rejections
window.addEventListener('unhandledrejection', e => {
  mw.notify(`There was an issue with a script on the page. This may be an issue with OOZE, or a script you have installed.
  If the OOZE interface is frozen, please reload the page. Background tasks should continue to run as long as the worker
  is still running.`, {
    type: 'error',
    autoHide: false,
    title: 'Something has broken.'
  })
});

// Add handler for when the #oozeFrame iframe posts a message

const oozeFrame = document.getElementById('oozeFrame') as HTMLIFrameElement;
if (!oozeFrame) throw new Error('oozeFrame not found. Cannot continue.');

const oozeCom = new ClientWorkerCommunicationProvider(oozeFrame);

// Every 250ms, send a heartbeat to the worker, so they know that we're still active
setInterval(async () => {
  const result = await oozeCom.workerFunction<typeof Heartbeat>('heartbeat');
  if (!result) console.error("Heartbeat failed.");
}, 250);



const app = new App({
  target: document.getElementById('ooze') as HTMLElement,
});



export default app;
export { oozeID, oozeCom };