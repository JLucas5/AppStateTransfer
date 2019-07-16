/**
 * Sends a message to ait-middleware (backgroud script) to start the state capture
 */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("handoff")) {
        console.log("oi")
        chrome.runtime.sendMessage({ "handoff": true });
        chrome.runtime.sendMessage({ "startResumeExperiment": true })
        console.log("heeeeey")
    } else if (e.target.classList.contains("resume")) {
        chrome.runtime.sendMessage({ "fetchState": true })
        chrome.runtime.sendMessage({ "startResumeExperiment": true })
    }
});