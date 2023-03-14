/*
OOZE by Ed6767
---
Load and render the app into the DOM. Initializes OOUI too.
*/
import { render } from 'preact'
import { App } from './app'
import initOOUI from './ooui/OOUIInit';

(async () => {
    // Initialize OOUI
    if (!(await initOOUI())) {
        console.error("OOUI failed to initialize!");
        return;
    }

    // Create a new element to render into
    const oozeContainer = document.createElement("div");
    oozeContainer.id = "ooze-container";
    document.querySelector("#app")?.appendChild(oozeContainer);

    // Render the app into the new element
    render(<App />, oozeContainer);
})();