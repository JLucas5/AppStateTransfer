
/**
 * Sends a message to ait-middleware (backgroud script) to start the state capture
 */
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("handoff")) {
        console.log("Clique")
        chrome.runtime.sendMessage({"handoff": document.getElementById("userLocation").value});
    }
});
