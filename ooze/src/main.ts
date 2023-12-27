import './app.css'
import App from './App.svelte'

// Add ooze to the DOM
// Create ooze div
const ooze = document.createElement('div')
ooze.id = 'ooze'
document.body.appendChild(ooze)

const app = new App({
  target: document.getElementById('ooze') as HTMLElement,
})

export default app;
