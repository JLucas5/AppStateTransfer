// Retreive DOM state data. Pre-Order Depth-first search.
function domTreeTraversal(node, state, retrieve) {

    if (node.nodeName == "TEXTAREA") {
        if (retrieve)
            state.push(node.value);
        else
            node.value = state.shift();
    } else if (node.nodeName == "INPUT") {
        switch (node.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "reset":
            case "submit":
                console.log("Input type " + node.type + " not supported");
                break;

            default:
                if (retrieve) {
                    state.push(node.value);
                } else
                    node.value = state.shift();
                break;
        }
    } else if (node.nodeName == "VIDEO" || node.nodeName == "AUDIO") {
        if (retrieve)
            state.push(node.currentTime);
        else
            node.currentTime = state.shift();
    }

    for (var it = node.firstChild; it != null; it = it.nextSibling)
        domTreeTraversal(it, state, retrieve);
}

// Injects a JavaScript script into web page's context.
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

/*
 * Calls onScriptMessage function in ait-middleware.js, the onScriptMessage
 * will call transfer function in ait-middleware.js
 */
function transfer(jsState) {
    console.log("Calling background to transfer...");
    var domState = [];
    domTreeTraversal(document.body, domState, true);
    chrome.runtime.sendMessage({ "domState": domState, "jsState": jsState });
}

// Receives message from state-gather.js and onfocus.js.
window.addEventListener("message", function(event) {
    if (event.source == window &&
        event.data.direction &&
        event.data.direction == "from-gather-script") {
            transfer(event.data.message);

    } else if (event.source == window &&
        event.data.direction &&
        event.data.direction == "from-onfocus-script") {
            chrome.runtime.sendMessage({ "focused": event.data.message });
    }
});

// Processes messages from the background script (ait-middleware.js).
function onBackgroundMessage(message) {
    if (message.get_state) {
        injectScript(chrome.extension.getURL('extension-scripts/state-gather.js'), 'body');
    } else if (message.resume) {

        domTreeTraversal(document.body, message.resume.pop(), false);
        window.setTimeout (() => { chrome.runtime.sendMessage({ "endExperiment": true });}, 0);

        injectScript(chrome.extension.getURL('extension-scripts/state-resume.js'), 'body');

        window.postMessage({
            direction: "from-content-script",
            message: message.
            resume.pop()
        }, "*");

        var url = new URL(window.location);
        var domain = url.hostname;
        if (domain.indexOf("www") == 0){
            domain = domain.slice(domain.indexOf("."), domain.length);
        }
        
        chrome.runtime.sendMessage({ "focused": domain });
        

    } else
        errorHandler("Could not call any function on content-script");
}

// Assign "onBackgroundMessage()" as a listener to messages from the background script.
chrome.runtime.onMessage.addListener(onBackgroundMessage);

//Sends a message to backgroud to start a state recover if a stored state exists
chrome.runtime.sendMessage({ "resume": "on content-script" });

injectScript(chrome.extension.getURL('extension-scripts/onfocus.js'), 'body');

// If something goes wrong.
function errorHandler(error) {
    console.log(error);
}