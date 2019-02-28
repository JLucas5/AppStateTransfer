function capture(){

    let message = {
        capture: "capture-state"
    }
    
    chrome.runtime.sendMessage(message)
    console.log("Capture message sent")
}

function restore(){

    let message = {
        restore: "restore-state"
    }

    chrome.runtime.sendMessage(message)
    console.log("Restore message sent")
}

document.getElementById("capture").addEventListener("click", capture)

document.getElementById("restore").addEventListener("click", restore)