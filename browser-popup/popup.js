/**
 * Sends a message to ait-middleware (backgroud script) to start the state capture
 */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("handoff")) {
        chrome.runtime.sendMessage({ "handoff": true });
        chrome.runtime.sendMessage({ "startHandoffExperiment": true })
    } else if (e.target.classList.contains("resume")) {
        chrome.runtime.sendMessage({ "fetchState": true })
        chrome.runtime.sendMessage({ "startResumeExperiment": true })
    }
});