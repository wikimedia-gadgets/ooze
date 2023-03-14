(()=>{
    // Generate a random number to prevent caching
    const random = Math.random().toString(36).substring(7);
    // Add a script to the page with type "module" to http://localhost:5173/@vite/client
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `http://localhost:5173/@vite/client`;
    document.body.appendChild(script);

    // Add a script to the page with type "module" to http://localhost:5173/src/main.tsx with the random number
    const script2 = document.createElement('script');
    script2.type = 'module';
    script2.src = `http://localhost:5173/src/main.tsx?${random}`;
    document.body.appendChild(script2);
})();