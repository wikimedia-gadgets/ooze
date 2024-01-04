import './app.css'
import App from './App.svelte'
import OozeWorkerPath from './lib/worker/index.ts?sharedworker&url';

// Add ooze to the DOM
// Create ooze div
const ooze = document.createElement('div');
ooze.id = 'ooze';
document.body.appendChild(ooze);

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

// Initialise the shared worker. We have to first get the URL, then fetch the contents, then place
// it in a blob, then create a worker from that blob. This avoids cross-origin issues.
const oozeWorkerURL = new URL(OozeWorkerPath, import.meta.url).href;

// Fetch the worker
fetch(oozeWorkerURL)
  .then(response => response.blob())
  .then(blob => {
    // Create the worker
    const blobURL = URL.createObjectURL(blob);
    console.log(blobURL);
    const worker = new SharedWorker(blobURL);
    worker.port.start();

    // When the worker sends a message, log it
    worker.port.addEventListener('message', e => {
      console.log(e.data);
    });

    // If error initializing worker, log it
    worker.onerror = e => {
      console.error(e);
    };
  });


const app = new App({
  target: document.getElementById('ooze') as HTMLElement,
});

export default app;