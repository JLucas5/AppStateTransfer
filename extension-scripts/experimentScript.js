var data = []

var initialTime = null
var endTime = null

function onMessage(message) {
    if (message.startHandoffExperiment) {
        initialTime = new Date()

    } else if (message.endHandoffExperiment) {
        transfer(message.domState, message.jsState);
        endTime = new Date()
        data.push(endTime - initialTime)
        console.log(data)
    } else if (message.resume) {
        resume();

    } else if (message.fetchState) {
        startRecovery();

    } else
        errorHandler("Could not call any function - on background");
}

function

chrome.runtime.onMessage.addListener(onMessage);