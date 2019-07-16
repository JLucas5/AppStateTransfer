// Setting up Firebase client.
var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);

var baseURL = "aitmiddleware/browser-extension";

/*
 * Listeners to receive any data change at these URLs.
 */
// Current device being used.
var currentDeviceRef = firebase.database().ref(baseURL + "/current-device");

// Reference to all registred devices.
var devicesRef = firebase.database().ref(baseURL + "/devices");

// Reference to IP address of all registred devices.
var devicesIPsRef = firebase.database().ref(baseURL + "/ips");

// Reference to all preferences registred by the user.
var userPreferencesRef = firebase.database().ref(baseURL + "/preferences");

// Reference to the latest uploaded application interaction session state.
var appStateRef = firebase.database().ref(baseURL + "/app-state");

// Reference to user location.
var userLocationRef = firebase.database().ref(baseURL + "/user-location");

currentDeviceRef.on("value", function(snapshot) {
    currentDevApp = snapshot.val();
}, errorHandler);

devicesRef.on("value", function(snapshot) {
    devices = snapshot.val();
}, errorHandler);

devicesIPsRef.on("value", function(snapshot) {
    devicesIPs = snapshot.val();
}, errorHandler);

userPreferencesRef.on("value", function(snapshot) {
    userPreferences = snapshot.val();
}, errorHandler);

appStateRef.on("value", function(snapshot) {
    var data = JSON.parse(snapshot.val());

    if (deviceID != -1 && deviceID == targetID) {
        mgtTabState = data.state;
        var cookies = mgtTabState.pop();
        var cookie;
        for (var ck = 0; ck < cookies.length; ck++) {
            cookie = cookies[ck];
            chrome.cookies.set({
                url: data.url,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                expirationDate: cookie.expirationDate
            });
        }
        chrome.tabs.create({ "url": data.url });
    }
}, errorHandler);

/*appStateRef.on("value", function (snapshot) {
    wsHandler.getState(currentDevApp.deviceID);
    
    wsHandler.wsRemote.onmessage = function(evt) {
        var data;

        //console.log("State received from ws:\n" + evt.data);
        data = JSON.parse(evt.data);

        if(deviceID != -1 && deviceID == targetID) {
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

        wsHandler.wsRemote.close(1000, "State received!");
    };
}, errorHandler);*/

userLocationRef.on("value", function(snapshot) {
    var data = snapshot.val();

    targetID = chooseTargetDevice(data);

    if (deviceID != -1 && targetID != -1 && deviceID != targetID &&
        deviceID == currentDevApp.deviceID) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            mgtTab = tabs[0];

            // Call content script to get state.
            chrome.tabs.sendMessage(mgtTab.id, { "get_state": " " });
        });
    }
}, errorHandler);

// If something goes wrong.
function errorHandler(error) {
    console.log(error);
}