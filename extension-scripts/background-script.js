/*
 * Reference to the Tab whose application session state will be migrated.
 * For type description, access https://developer.chrome.com/extensions/tabs#type-Tab.
 */
var mgtTab;

/*
 * Full application state, i.e, union of HTML DOM, JS Document and Cookies.
 * mtgTabState is initiated on the background script, so it exists on the browser scope
 * The same instance of the variable is accessible from any Tab.
 */
var mgtTabState = null;

// Starts handoff process, calling content script to get the state
function startHandoff() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        mgtTab = tabs[0];

        // Call content script to get state.
        chrome.tabs.sendMessage(mgtTab.id, { "get_state": " " });
    });
}

// Sends state through Sprinkler connection, ending the application flow.
function transfer(domState, jsState) {
    var url = new URL(mgtTab.url);
    var domain = url.hostname;
    if (domain.indexOf("www") == 0)
        domain = domain.slice(domain.indexOf("."), domain.length);

    chrome.cookies.getAll({ domain: domain }, function(cookies) {

        var appState = [];
        appState.push(jsState);
        appState.push(domState);
        appState.push(cookies);

        var completeAppState = JSON.stringify({ "url": mgtTab.url, "state": appState });
        var encodedState = b64EncodeUnicode(completeAppState)

        var request = new XMLHttpRequest()
        request.open('PUT', 'http://13.0.0.2:10338/session', false)
        request.send(JSON.stringify({ session: encodedState }));

        if (request.status === 200) {
            console.log(request.responseText)
        }
        chrome.runtime.sendMessage({ "endResumeExperiment": true })
        // Close Tab from all state data was retrieved
        //chrome.tabs.remove(mgtTab.id);

    });
}

/**
 * Sends current state to onBackgroundScript() on content-script at the active Tab. 
 * Checks if there is a state stored on mtgTabState sends the state to the content-script scope and empties the variable.
 */

function resume() {
    if (mgtTabState != null) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { "resume": mgtTabState });
            mgtTabState = null;
        });
    } else {
        console.log("No state was found")
    }

}

function startRecovery() {
    //TODO GET REST API
    var request = new XMLHttpRequest()
    request.open('GET', 'http://13.0.0.2:10338/session', false) // `false` makes the request synchronous
    request.send(null)

    if (request.status === 200) {
        var fooState = JSON.parse(b64DecodeUnicode((JSON.parse(request.responseText)).session))

        mgtTabState = fooState.state

        var cookies = mgtTabState.pop()
        var cookie;
        for (var ck = 0; ck < cookies.length; ck++) {
            cookie = cookies[ck]
            chrome.cookies.set({
                url: fooState.url,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                expirationDate: cookie.expirationDate
            });
        }
    } else {
        console.error(xhr.statusText)
    }

    chrome.tabs.create({ "url": fooState.url });


};

/*
 * Receives messages from the content script and popup script. 
 * Used as callback for chrome.runtime.onMessage.addListener.
 * For parameter types description, access https://developer.chrome.com/extensions/runtime#event-onMessage.
 */
function onScriptMessage(message) {
    if (message.handoff) {
        startHandoff(message.handoff);

    } else if (message.domState) {
        transfer(message.domState, message.jsState);

    } else if (message.resume) {
        resume();

    } else if (message.fetchState) {
        startRecovery();

    } else
        errorHandler("Could not call any function - on background");
}

// Assign "onScriptMessage()" as a listener to messages from the content script and popup script.
chrome.runtime.onMessage.addListener(onScriptMessage);

// If something goes wrong.
function errorHandler(error) {
    console.log(error);
}

/**
 * The next two functions are used to encode and decode unicode characters.
 * This way btoa() can be used on any string.
 */

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}