"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} : ${message}`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
document.getElementById("messageInput").addEventListener("input", function () {
    var user = document.getElementById("userInput").value;
    connection.invoke("NotifyTyping", user).catch(function (err) {
        return console.error(err.toString());
    });
});

connection.on("UserTyping", function (user) {
    var typingElement = document.getElementById("typingNotification");
    typingElement.textContent = `${user} is typing...`;
    setTimeout(function () {
        typingElement.textContent = "";
    }, 3000);
});