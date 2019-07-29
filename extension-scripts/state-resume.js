// Receives message from content script.
window.addEventListener("message", function(event) {
    if (event.source == window &&
        event.data.direction &&
        event.data.direction == "from-content-script") {

        var jsState = JSON.parse(event.data.message);
        var appState = false;
        
        for (var prop in window) {
            if (appState && typeof window[prop] !== 'function')
                window[prop] = jsState.shift();

            if (prop == "$")
                appState = true;
        }

        //Experiment code
        window.postMessage({
            direction: "from-state-resume-experiment",
            message: "experiment ended"
        }, "*");
        
    }
});