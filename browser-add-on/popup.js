function capture(tab){

    let msg= {
        title: "capture-state"
    }
    chrome.runtime.sendMessage(tab.id, msg)

    console.log("Capture message sent")
}

function restore(tab){

    let msg= {
        title: "restore-state"
    }

    chrome.runtime.sendMessage(tab.id, msg)
    console.log("Restore message sent")
}