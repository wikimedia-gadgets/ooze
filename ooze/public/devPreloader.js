(()=>{

    // Generate a random number to prevent caching
    const random = Math.random().toString(36).substring(7);
    // Vite
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `http://localhost:5730/@vite/client`;
    document.body.appendChild(script);

    // Main
    const script2 = document.createElement('script');
    script2.type = 'module';
    script2.src = `http://localhost:5730/src/main.tsx?${random}`;
    document.body.appendChild(script2);
})();