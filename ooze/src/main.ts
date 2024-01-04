import './app.css'
import App from './App.svelte'

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

// Add handler for when the #oozeFrame iframe posts a message
window.addEventListener('message', e => {
  if (e.data.type === 'oozeWorker') {
    // Log to console
    console.log(`Message from worker: ${e.data.data}`);
  }
});

const app = new App({
  target: document.getElementById('ooze') as HTMLElement,
});

export default app;