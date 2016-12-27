window.onload = function() {

    var messages = [];

    var host = 'https://guarded-lowlands-86253.herokuapp.com';
    var socket = io.connect(host);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + '<h4 style="font-family: Ubuntu Condensed; padding-left: 4px; margin-top: 2px; margin-bottom: 0; display: inline-block;">' + (messages[i].username ? messages[i].username : 'Server') + '</h4>' + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: '<h4 style="display: inline-block; font-family: Roboto Condensed; margin-top: 2px; margin-bottom: 0;">' + text + '</h4>', username: '<h4 style="margin-top: 2px; margin-bottom: 0; font-family: Ubuntu Condensed; display: inline-block">' + name.value + '</h4>' });
        }

    };



}
