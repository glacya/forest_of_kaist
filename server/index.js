// const session = require('express-session');
const passport = require('passport');
const express = require('express')();
var router = express.router();
const server = require('http').createServer(app);
const port = process.env.PORT || 80;
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done)=>{
    console.log('passport session save: ', user.id);
    done(null, user.id);
})

passport.deserializeUser((id, done)=>{
    console.log('passport session get id: ', id);
    done(null, id);
})

passport.use('local', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    passReqToCallback: true
}, function(req, user_id, user_pw, done) {
    if(user_id==process.env.LOGIN_ID && user_pw==process.env.LOGIN_PW){
        const user={
            user_id: user_id,
            user_pw: user_pw
        }
        console.log("Login check succeeded.");
        return done(null, user)
    }
    else
        return done(null, false, {'message' : 'Incorrect email or password'})
    }
));



var dir_name = "/root/forest_of_kaist/client/"

function debug(str) {
    var time = new Date();
    var t = time.toLocaleString();
    console.log(t + ": " + str);
}

// TEMP CODE: set rendering option to EJS
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // TODO: redirect to login page.
    // TODO: if login cookie exists, redirect to main game page.
    debug("GET /");
    // res.sendFile(dir_name + "test.html");
    res.render(dir_name + "test.ejs");
});

app.get("/:file", (req, res) => {
    var file = req.params.file;
    debug(`GET: /${file}`);
    res.sendFile(dir_name + file);
})

// main game.
// TODO: redirect to login page if not logged in.
// TODO: deliver page to user.
app.get("/game.js", (req, res) => {
    debug("hi");
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
        debug("??");
        io.emit('server_msg', "ㅋㅋㅋ");
    });
});

server.listen(port, function() {
    debug('서버 켰다.');
});