/*
 * Reference to the Tab whose application session state will be migrated.
 * For type description, access https://developer.chrome.com/extensions/tabs#type-Tab.
 */
var mgtTab;

// Full application state, i.e, union of HTML DOM, JS Document and Cookies.
var mgtTabState = null;

// Starts handoff process, calling content script to get the state
function startHandoff() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        mgtTab = tabs[0];
        
        // Call content script to get state.
        console.log("StartHandoff()")
        chrome.tabs.sendMessage(mgtTab.id, {"get_state": " "});
    });
}

// Sends state through cloud service or websocket connection.
function transfer(domState, jsState) {
    var url = new URL(mgtTab.url);
    var domain = url.hostname;
    if(domain.indexOf("www") == 0)
        domain = domain.slice(domain.indexOf("."), domain.length);

    chrome.cookies.getAll({domain: domain}, function(cookies) {
        var appState = [];
        appState.push(jsState);
        appState.push(domState);
        appState.push(cookies);

        var completeAppState = JSON.stringify({"deviceID": "01", "url": mgtTab.url, "state": appState});
        
        
        console.log("Estado da Aplicação: " + completeAppState);

        // Close Tab from all state data was retrieved
        //chrome.tabs.remove(mgtTab.id);
    });
}

// Sends current state to content script at the active Tab.
function resume() {
    if(mgtTabState != null)
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"resume": mgtTabState});
            mgtTabState = null;
        });
}

function startRecovery(){
    //TODO
    //GET state from REST API and save on data
    mgtTabState = data.state;
        var cookies = mgtTabState.pop();
        var cookie;
        for(var ck = 0; ck < cookies.length; ck++) {
            cookie = cookies[ck];
            chrome.cookies.set({url: data.url, name: cookie.name,
                value: cookie.value, domain: cookie.domain, path: cookie.path,
                secure: cookie.secure, httpOnly: cookie.httpOnly,
                expirationDate: cookie.expirationDate});
        }
        chrome.tabs.create({"url": data.url});
}

/*
 * Receives messages from the content script and popup script. 
 * Used as callback for chrome.runtime.onMessage.addListener.
 * For parameter types description, access https://developer.chrome.com/extensions/runtime#event-onMessage.
 */
function onScriptMessage(message) {
    console.log("Content script message received: ");
    if(message.handoff) {
        console.log("Start Handoff")
        startHandoff(message.handoff);
    }
    else if(message.domState) {
        console.log("Transfer State")
        transfer(message.domState, message.jsState);
    }
    else if(message.resume) {
        console.log("Resume State")
        resume(); 
    }
    else
        errorHandler("Could not call any function");
}

// Assign "onScriptMessage()" as a listener to messages from the content script and popup script.
chrome.runtime.onMessage.addListener(onScriptMessage);

// If something goes wrong.
function errorHandler(error) {
    console.log(error);
}
