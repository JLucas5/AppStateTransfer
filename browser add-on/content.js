//State Gather
let stateGather = {
    appState: false,
    jsState: [],
    getState: function() {
        for(let prop in window) {
            if(this.appState && typeof window[prop] !== 'function' && prop != "stateGather")
                this.jsState.push(window[prop]);

            if(prop == "$")
                this.appState = true;
        }
    }
}

stateGather.getState();

window.postMessage({
    direction: "from-gather-script",
    message: JSONR.stringify(stateGather.jsState)
}, "*");
