/**
 * Sends a message to background-script.js to start the state capture or restoration
 */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("handoff")) {
        chrome.runtime.sendMessage({ "handoff": true });
    } else if (e.target.classList.contains("resume")) {
        chrome.runtime.sendMessage({ "fetchState": true })
    }
});