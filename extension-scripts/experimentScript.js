var data = []

var initialTime = null
var endTime = null

function onExperimentMessage(message) {
    if (message.startHandoffExperiment) {
        initialTime = new Date()
        console.log("start experiment")

    } else if (message.endHandoffExperiment) {
        endTime = new Date()
        data.push(endTime - initialTime)
        console.log(data)
    } else if (message.startResumeExperiment) {
        initialTime = new Date()

    } else if (message.endResumeExperiment) {
        endTime = new Date()
        data.push(endTime - initialTime)
        console.log(data)

    } else
        errorHandler("Could not call any function - on background");
}

chrome.runtime.onMessage.addListener(onExperimentMessage);