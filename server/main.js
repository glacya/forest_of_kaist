var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;

var dir_name = "/root/forest_of_kaist/client/"

function debug(str) {
    var time = new Date();
    var t = time.toLocaleString();
    console.log(t + str);
} 

// TEMP CODE: set rendering option to EJS
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // TODO: redirect to login page.
    // TODO: if login cookie exists, redirect to main game page.
    console.log("GET /");
    // res.sendFile(dir_name + "test.html");
    res.render(dir_name + "test.ejs");
});

app.get("/:file", (req, res) => {
    var file = req.params.file;
    console.log(`GET: /${file}`);
    res.sendFile(dir_name + file);
})

// main game.
// TODO: redirect to login page if not logged in.
// TODO: deliver page to user.
app.get("/game.js", (req, res) => {
    console.log("hi");
})

io.on('connection', (socket) => {
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    

    socket.on('move', (msg) => {
        // MEMO: 'msg' contains variable sent from client.
        // In this case, msg would contain the followings:
        // - ID of the user
        // - position of the user (x, y)

        debug("move: 이동함");
        // Emit position to every client connected to the server.
        // The clients will take care of movements.
        io.emit('move', msg);
    });

    socket.on('enter_building', (msg) => {
        // MEMO: do we really need to enter building?
        debug('enter_building: 빌딩 들어감');
    });

    socket.on('client_msg', (msg) => {
        console.log("??");
        io.emit('server_msg', "ㅋㅋㅋ");
    });
});

server.listen(port, function() {
    console.log('서버 켰다.');
});