var app = require('express')();
var cors = require('cors');
app.use(cors());
var server = require('http').createServer(app);
var io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

var port = process.env.PORT || 8000;

app.get('/', function(req, res) {
    res.send("got");
 });
 

io.on('connection', (socket) => {
    socket.on("move", (msg) => console.log(`Got message from socket id ${socket.id}: (x: ${msg.x}, y: ${msg.y})`));
});

console.log("test?");

server.listen(port, function() {
    console.log('Server is on ' + port);
});