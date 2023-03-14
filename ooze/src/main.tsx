/*
OOZE by Ed6767
---
Load and render the app into the DOM. Initializes OOUI too.
*/
import { render } from 'preact'
import { App } from './app'

// Create a new element to render into
const oozeContainer = document.createElement("div");
oozeContainer.id = "ooze-container";
document.body.appendChild(oozeContainer);

// Render the app into the new element
render(<App />, oozeContainer);