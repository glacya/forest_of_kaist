var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;

var dir_name = "/root/forest_of_kaist/client/"

// TEMP CODE: set rendering option to EJS
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // TODO: redirect to login page.
    // TODO: if login cookie exists, redirect to main game page.
    console.log("GET /");
    // res.sendFile(dir_name + "test.html");
    res.render(dir_name + "test.ejs");
});

app.get("")

// main game.
// TODO: redirect to login page if not logged in.
// TODO: deliver page to user.
app.get("/game.js", (req, res) => {
    console.log("hi");
})

io.on('connection', (socket) => {
    
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    socket.emit('usercount', io.engine.clientsCount);

    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
    socket.on('message', (msg) => {
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + msg);

        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        io.emit('message', msg);
    });

    socket.on('client_msg', (msg) => {
        console.log("??");
        io.emit('server_msg', "ㅋㅋㅋ");
    });
});

console.log("test?");

server.listen(port, function() {
    console.log('Server is on!!');
});