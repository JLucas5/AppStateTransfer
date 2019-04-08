chrome.runtime.sendMessage({"getID": " "}, function(response) {
    document.getElementById("devID").value = response.devID;
});


/**
 * Sends a message to ait-middleware (backgroud script) to start the state capture
 */
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("handoff")) {
        chrome.runtime.sendMessage({"handoff": document.getElementById("userLocation").value});
    }
});
