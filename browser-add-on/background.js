var config = {
    apiKey: "AIzaSyCYrrdz0TNv8uXGkzcF20WjSP5S9c0jqjU",
    authDomain: "teste-ait-middleware.firebaseapp.com",
    databaseURL: "https://teste-ait-middleware.firebaseio.com",
    projectId: "teste-ait-middleware",
    storageBucket: "teste-ait-middleware.appspot.com",
    messagingSenderId: "17327098132"
};

//firebase.initializeApp(config);

//var database = firebase.database();

chrome.runtime.onMessage.addListener(function(message, sender){
    if(message.state){
        console.log("State received");
        firebase.database().ref('state/DOM').set({
             DOMstate: message.state
          });
    }
})
