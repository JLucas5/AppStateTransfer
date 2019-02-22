function capture(tab){

    let message = {
        capture: "capture-state"
    }
    
    chrome.runtime.sendMessage(tab.id, message)
    console.log("Capture message sent")
}

function restore(tab){

    let message = {
        restore: "restore-state"
    }

    chrome.runtime.sendMessage(tab.id, message)
    console.log("Restore message sent")
}