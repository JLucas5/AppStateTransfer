/*
Receives a message from the pop.up button click
*/
chrome.runtime.onMessage.addListener(function(message, sender){
    if(message.capture){
        console.log("Calling background to transfer...");
        var domState = [];
        domTreeTraversal(document.body, domState, true);
        chrome.runtime.sendMessage({"domState": domState, "jsState": jsState});
    }
})

function domTreeTraversal(node, state, retrieve) {
    
    if(node.nodeName == "TEXTAREA") {
        if(retrieve)
            state.push(node.value);
        else
            node.value = state.shift();
    }
    else if(node.nodeName == "INPUT") {
        switch(node.type){
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "reset":
            case "submit":
                console.log("Input type " + node.type + " not supported");
                break;

            default:
                if(retrieve)
                    state.push(node.value);
                else
                    node.value = state.shift();
                break;
        }
    }
    else if(node.nodeName == "VIDEO" || node.nodeName == "AUDIO") {
        if(retrieve)
            state.push(node.currentTime);
        else
            node.currentTime = state.shift();
    }
    
    for(var it = node.firstChild; it != null; it = it.nextSibling)
        domTreeTraversal(it, state, retrieve);
}