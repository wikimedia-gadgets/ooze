// The ooze loader - for development at the moment

// Append an iframe with id 'oozeFrame'. The script will look for this for communication with the shared worker
const oozeFrame = document.createElement('iframe');
oozeFrame.id = 'oozeFrame';
oozeFrame.style.display = 'none';
oozeFrame.src = 'https://localhost:5173/oozeWorkerContainer.html';
document.body.appendChild(oozeFrame);

// Add a script tag with type module to localhost:5173/src/main.ts?t=(current time in ms)

const oozeScript = document.createElement('script');
oozeScript.type = 'module';
oozeScript.id = 'oozeentryscript';
oozeScript.src = 'https://localhost:5173/src/main.ts?t=' + Date.now();
document.head.appendChild(oozeScript);