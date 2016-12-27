var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  var address = socket.handshake.address;
  console.log('New Connection From ' + address.address + ':' + address.port);
  socket.on('send', function (data) {
  io.emit('message', data);
  });
});

console.log("Susie is awesome! (Listening on Port " + port + ")");
