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
    if(mgtTabState != null){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"resume": mgtTabState});
            mgtTabState = null;
        });
    }else{
        console.log("No state was found")
    }
        
}

function startRecovery(){
    //TODO REST API
    console.log("Conecting to API")
    
     var fooState = {
        "deviceID":"01",
        "url":"https://github.com/Edionay/doemais/wiki/Home/_edit",
        "state":[
           "[]",
           [
              "✓",
              "",
              "",
              "✓",
              "fm7mf+XGBbFG46izD1+eJGoYGt6CDAH+vU23dT9L3OLdZKzFAij5EcRBSlDR+9s24uoeYAJji/yNXet7XBTKEQ==",
              "✓",
              "put",
              "+NKuFrCA26sdDAfX/yBGN8GawZZIkbcWK1wG0fRIcGZhb/awa8sc1odoaURT8SF9Z5Ag3cm5i+hyMLkG9ASnXA==",
              "",
              "",
              "",
              "",
              "✓",
              "8J89WM8dm6VtaJZEzUkTTObQ7moXZ/HfZw7Sn2n6WDRTlXfiKPNnBe/KdKcT7VZebiLq1JcIe91XHo6RCqVOxw==",
              "✓",
              "MHz2QQs040fScyBsBhHDUmNMeMo6qT+kvhUbWZkqppmWDdkXMqV46UwAAVjHmia2d4fwOLtJNNaVJ5kNYZT9ZQ==",
              "153188861",
              "✓",
              "CGjssgG58FrDxpT5CLHxQWEuCz7Pqp/5IwAjgGVplcBcJ9zO3Bl1I/+wCmJqFalExFa1TXig4XYpQj0wq1y0xA==",
              "repository",
              "✓",
              "5O/ZU/W0id5fMWWs7YXrs0rZiV0pmh9/n9Fh5WY8X4HRgEESSLQRoCFHZH0NVPl+dmyHkKTuKCXj/GjWG+Gjew==",
              "repository",
              "b859e6526399f8abc587688e80b3a54c1c4e9ba6",
              "✓",
              "put",
              "RaXZKOvVXTxV2h23U9Zo7lXzKT+BRYrU8yt3PZ/qykUG1ew10s4FMt/L0eDXRK5WfPTNer5bnIgAmdcN0WeDkg==",
              "Home",
              "I changed it. Mwahaha",
              ""
           ],
           [
              {
                 "name":"_octo",
                 "value":"GH1.1.1496387959.1539713677",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":false,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1602872077,
                 "storeId":"firefox-default"
              },
              {
                 "name":"_gid",
                 "value":"GA1.2.456210039.1541701269",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":false,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1541787669,
                 "storeId":"firefox-default"
              },
              {
                 "name":"_device_id",
                 "value":"d91c1239a9535e2ce4c6a0b64761e235",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":2185027675,
                 "storeId":"firefox-default"
              },
              {
                 "name":"logged_in",
                 "value":"yes",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":2185027675,
                 "storeId":"firefox-default"
              },
              {
                 "name":"dotcom_user",
                 "value":"JLucas5",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":2185027675,
                 "storeId":"firefox-default"
              },
              {
                 "name":"_ga",
                 "value":"GA1.2.929921181.1539713679",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":false,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1617905274,
                 "storeId":"firefox-default"
              },
              {
                 "name":"_gat",
                 "value":"1",
                 "domain":".github.com",
                 "hostOnly":false,
                 "path":"/",
                 "secure":false,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1554833874,
                 "storeId":"firefox-default"
              },
              {
                 "name":"tz",
                 "value":"America%2FSao_Paulo",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":true,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":true,
                 "firstPartyDomain":"",
                 "storeId":"firefox-default"
              },
              {
                 "name":"user_session",
                 "value":"MbS2U_2tDEuOgxyPop3Td65lRvKDvOnQG62oTxmx-u5P3UNC",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1556043042,
                 "storeId":"firefox-default"
              },
              {
                 "name":"__Host-user_session_same_site",
                 "value":"MbS2U_2tDEuOgxyPop3Td65lRvKDvOnQG62oTxmx-u5P3UNC",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"strict",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1556043042,
                 "storeId":"firefox-default"
              },
              {
                 "name":"has_recent_activity",
                 "value":"1",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":false,
                 "httpOnly":false,
                 "sameSite":"no_restriction",
                 "session":false,
                 "firstPartyDomain":"",
                 "expirationDate":1554837042,
                 "storeId":"firefox-default"
              },
              {
                 "name":"_gh_sess",
                 "value":"bTlJUGxabUpVQzREMjRSZ25IVDNFSGUyVThWcHlSMnVNUlNBekJLMUQ3RkpLSDc5dGdCbld6c05HaEFrQjNBQU5XMzk4TGdzRUt1djFoSjNOVGNCQ3NoTUFwamI2WmNGcG5OMGVmY2x1d3Y0M0hKUjhTNWJ5UGdGVzEvK3B6VEpkUTlwWFBaQWZpUTMwemdEdzRXT0RhcHhPMlhDVVRJdjJaejNaLzgvSW5XUk04SnNBZGltSUplSDhhcHA0enBGMlJxcWdpZE1xbWM0N2JRczdLUWg3Z0FWUFNDdmV4YjRPMEF1VHdDVW5VbnNQSnZxTVFKQ2NUeGVTZURSdmRGckVFaTBHYWlZQStJc2doZzFqaGFvLzl3OENWa0QyZG1oR2RucXFtOWExd202UDlvWDY0QVN2Ylk2NCtaQ0NRRHRQbHljeHF1K3NxZkJkTUhYQXhoMEhRPT0tLUpwWVJqbUc0WXhYdjZmUzhMSEtPc3c9PQ%3D%3D--afece1f48fd09b2bfa170d22459ff0e50ea41db8",
                 "domain":"github.com",
                 "hostOnly":true,
                 "path":"/",
                 "secure":true,
                 "httpOnly":true,
                 "sameSite":"no_restriction",
                 "session":true,
                 "firstPartyDomain":"",
                 "storeId":"firefox-default"
              }
           ]
        ]
     }

    mgtTabState = fooState.state

    var cookies = mgtTabState.pop();
    var cookie;
    for(var ck = 0; ck < cookies.length; ck++) {
        cookie = cookies[ck];
        chrome.cookies.set({url: fooState.url, name: cookie.name,
            value: cookie.value, domain: cookie.domain, path: cookie.path,
            secure: cookie.secure, httpOnly: cookie.httpOnly,
            expirationDate: cookie.expirationDate});
    }
    chrome.tabs.create({"url": fooState.url});
};


/*
 * Receives messages from the content script and popup script. 
 * Used as callback for chrome.runtime.onMessage.addListener.
 * For parameter types description, access https://developer.chrome.com/extensions/runtime#event-onMessage.
 */
function onScriptMessage(message) {
    console.log("Content script message received on - from background: ", message);
    if(message.handoff) {
        console.log("Start Handoff - on background")
        startHandoff(message.handoff);
    }
    else if(message.domState) {
        console.log("Transfer State - on background")
        transfer(message.domState, message.jsState);
    }
    else if(message.resume) {
        console.log("Resume State - on background")
        resume(); 
    }else if(message.fetchState){
        console.log("Start recovery - on background")
        startRecovery();
    }
    else
        errorHandler("Could not call any function - on background");
}

// Assign "onScriptMessage()" as a listener to messages from the content script and popup script.
chrome.runtime.onMessage.addListener(onScriptMessage);

// If something goes wrong.
function errorHandler(error) {
    console.log(error);
}
