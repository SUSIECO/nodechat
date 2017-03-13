window.onload = function() {

    var messages = [];
    var names = [];

    // Setup Special Effects
    var specialEffects = [{
            'code': '{=>}',
            'effect': rocketAnimation
        }, {
            'code': '{Puppy}',
            'effect': puppyAnimation
        }, {
            'code': '{Puppy2}',
            'effect': runningPuppy
        }

    ];

    // Switch Between These Two Links on the Host When Testing and Publishing
    // https://guarded-lowlands-86253.herokuapp.com - Publishing [Public Link]
    // http://localhost:3700 - Testing [Private Link]
    var host = 'https://guarded-lowlands-86253.herokuapp.com';
    var socket = io.connect(host);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("textlayer");
    var display = document.getElementById("displaylayer");
    var name = document.getElementById("name");
    var hostname = document.getElementById("hostname")
    var users = document.getElementById("users");

    hostname.innerHTML = host;

    document.getElementById("start").onclick = startChat;

    function startChat() {
        if (name.value == "") {
            alert("Please type your name!");
        } else {
            console.log("Chat Starting!");
            $("#field").prop('readonly', false);
            display.style.opacity = 0;
        }
    }

    function applyEffects(message) {
        $.each(specialEffects, function(index, value) {
            if (message.match(value.code)) {

                // Execute the Effect
                value.effect();
            }
        });
    }

    function checkTypingAnimation(message, username) {
        if (message == "{TYPING}") {
            submitName(username, true)
            return true
        }
        if (message == "{CLEAR-TYPING}") {
            submitName(username, false)
            return true
        }
        return false
    }

    // Receives the Messages
    socket.on('message', function(data) {
        if (data.message) {


            if (checkTypingAnimation(data.message, data.username)) {
                return;
            } else {
                submitName(data.username, false)
            }

            applyEffects(data.message);

            messages.push(data);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + '<h4 style="font-family: Ubuntu Condensed; padding-left: 4px; margin-top: 2px; margin-bottom: 0; display: inline-block;">' + (messages[i].username ? messages[i].username : 'Server') + '</h4>' + ': </b>';
                html += '<h4 id="message">' + messages[i].message + '</h4>' + '<br />';
            }
            $('#content').animate({
                'scrollTop': content.scrollHeight
            }, 200);
            content.innerHTML = html;
            $('#receive')[0].play();

            submitName(data.username);

        } else {
            console.log("There is a problem:", data);
        }
    });

    // When the Send Button is Clicked, it Executes submitChat
    $('#send').click(function() {
        submitChat();
    });

    // When the Enter Key is Pressed, it Executes submitChat
    $('#field').keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            submitChat();
        }
    });

    // Submits Message
    function submitChat() {
        if (name.value == "") {
            console.log("Name is missing");
        } else {
            var text = field.value;
            $('#content').animate({
                'scrollTop': content.scrollHeight
            }, 200);
            $('#sendsound')[0].play();
            field.value = "";
            socket.emit('send', {
                message: text,
                username: name.value
            });
            //submitName(name.value);
        }
    }

    // Adds Name to Users List, if Name is not Already Present
    function submitName(name, isTyping) {
        var i = findName(name)
        if (i == -1) {
            names.push({
                'name': name,
                'isTyping': isTyping
            });
        } else {
            names[i].isTyping = isTyping
        }

        var html = ""
        for (var i = 0; i < names.length; i++) {
            html += '<div><b>' + '<h4 style="font-family: Ubuntu Condensed; padding-left: 4px; margin-top: 2px; margin-bottom: 0; display: inline-block;">' + names[i].name + '</h4> </b>';
            if (names[i].isTyping) {
                html += '<img id="typing" src="images/giphy.gif" style="padding-bottom: 3px;z-index:500;height: 10px;">'
            }
            html += '</div>'
        }
        users.innerHTML = html
    }

    function findName(name) {
        for (var i = 0; i < names.length; i++) {
            if (names[i].name == name) {
                return i;
            }
        }
        return -1;
    }

    // Typing Animation
    setInterval(checkForContent, 1500);

    var previousMessageValue = ""

    function checkForContent() {
        var userTyping = false;

        var messageValue = document.getElementById('field').value

        if (messageValue == previousMessageValue) {
            return
        }

        if (name.value == '') {
            return
        }

        if (messageValue == '') {
            console.log("Not Typing.");
            socket.emit('send', {
                message: '{CLEAR-TYPING}',
                username: name.value
            });
        } else {
            console.log("Typing!");
            socket.emit('send', {
                message: '{TYPING}',
                username: name.value
            });
        }
        previousMessageValue = messageValue
    }

    // Rocket Animation
    function rocketAnimation() {
        $('<img id="rocket" src="images/rocket.png" style="position:absolute;opacity:0;z-index:500">').on('load', function() {

            $('#animationlayer').append($(this));
            var rocket = $('#rocket');
            rocket.css({
                top: $('#content').prop('scrollHeight') - rocket.height(),
                left: $('#content').width() / 2,
                position: 'absolute',
                opacity: 1
            });
            console.log(rocket.height());

            rocket.animate({
                top: $('#content').prop('scrollHeight') - $('#content').height() - rocket.height(),
                left: $('#content').width() / 2,
            }, 1000, function() {
                rocket.remove()
            });
        });
    }

    // Puppy Animation
    function puppyAnimation() {
        $('<img id="puppy" src="images/puppy1.gif" style="position:absolute;opacity:0;z-index:500">').on('load', function() {

            $('#animationlayer').append($(this));
            var puppy = $('#puppy');
            puppy.css({
                top: $('#content').prop('scrollHeight') - puppy.height(),
                left: 0,
                position: 'absolute',
                opacity: 1
            });

            puppy.animate({
                top: $('#content').prop('scrollHeight') - puppy.height(),
                left: $('#animationlayer').width() - puppy.width(),
            }, 1500, function() {
                puppy.remove()
            });
        });
    }

    // Second Puppy Animation
    function runningPuppy() {
        $('<img id="puppy" src="images/puppyanim.gif" style="position:absolute;opacity:0;z-index:500">').on('load', function() {

            $('#animationlayer').append($(this));
            var puppy = $('#puppy');
            puppy.css({
                top: $('#content').prop('scrollHeight') - $('#content').height() / 2 - puppy.height() / 2,
                left: $('#animationlayer').width() / 2 - puppy.width() / 2,
                position: 'absolute',
                opacity: 1
            });

            puppy.animate({
                opacity: 1
            }, 3000, function() {
                puppy.remove()
            });
        });
    }
}
