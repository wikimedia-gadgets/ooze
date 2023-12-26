// Add a script tag with type module to localhost:5173/src/main.ts?t=(current time in ms)

const oozeScript = document.createElement('script');
oozeScript.type = 'module';
oozeScript.src = 'http://localhost:5173/src/main.ts?t=' + Date.now();
document.head.appendChild(oozeScript);