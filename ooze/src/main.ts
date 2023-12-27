import './app.css'
import App from './App.svelte'
import CodexBridge from './lib/CodexBridge'

// Wrap and prepare Vue components
CodexBridge.init()

// Add ooze to the DOM
// Create ooze div
const ooze = document.createElement('div')
ooze.id = 'ooze'
document.body.appendChild(ooze)

const app = new App({
  target: document.getElementById('ooze') as HTMLElement,
})

export default app;
