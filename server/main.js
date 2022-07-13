var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


console.log("test?");

server.listen(80, function() {
    console.log('Server is on!!');
  });