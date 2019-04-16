
/**
 * Sends a message to ait-middleware (backgroud script) to start the state capture
 */
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("handoff")) {
        console.log("Clicou Handoff")
        chrome.runtime.sendMessage({"handoff": true});
    }
    else if(e.target.classList.contains("resume")) {
        console.log("Clicou Resume")
        chrome.runtime.sendMessage({"fetchState": true})
    }
});
