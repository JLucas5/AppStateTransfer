var aitMiddleware = {
    appState: false,
    jsState: [],
    getState: function() {
        for (var prop in window) {
            if (this.appState && typeof window[prop] !== 'function' && prop != "aitMiddleware")
                this.jsState.push(window[prop]);

            if (prop == "$")
                this.appState = true;
        }
        console.log("State Gathered");
    }
}

aitMiddleware.getState();

window.postMessage({
    direction: "from-gather-script",
    message: JSON.stringify(aitMiddleware.jsState)
}, "*");