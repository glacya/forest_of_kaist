const session = require('express-session');
const passport = require('passport');
const app = require('express')();
var cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const fs = require('fs');
const data = fs.readFileSync('./conf.json');
const conf = JSON.parse(data);
const cookieParser = require('cookie-parser');

app.use(cors());
const server = require('http').createServer(app);
const port = process.env.PORT || 80;
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    'transports': [
        'websocket',
        'polling'
    ]
});

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    database: conf.database
});

app.use(cookieParser());
app.use(session({
    name: "session_cookie",
    secret: "hmmm",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 1000      // 1 hours
    }
}));
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
}, function(req, id, pw, done) {
    if(id==process.env.LOGIN_ID && pw==process.env.LOGIN_PW){
        const user={
            id: id,
            pw: pw
        }
        console.log("Login check succeeded.");
        return done(null, user)
    }
    else
        return done(null, false, {'message' : 'Incorrect email or password'})
    }
));


var dir_name = "/root/forest_of_kaist/client/forest-of-kaist/"

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
    debug("query parameter: ID = " + req.query.username + ", PW = " + req.query.password);
    res.sendFile("/root/forest_of_kaist/server/test.html");
});

app.get("/:file", (req, res) => {
    var file = req.params.file;
    debug(`GET: /${file}`);
    res.sendFile(dir_name + file);
});

app.get("/src/:file", (req, res) => {
    var file = req.params.file;
    debug(`GET: /src/${file}`);
    res.sendFile(dir_name + "src/" + file);
})

// main game.
// TODO: redirect to login page if not logged in.
// TODO: deliver page to user.
app.get("/game.js", (req, res) => {
    debug("hi");
})

io.on('connection', (socket) => {
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    debug("hi");

    socket.on("move", (msg) => {
        // MEMO: 'msg' contains variable sent from client.
        // In this case, msg would contain the followings:
        // - ID of the user
        // - position of the user (x, y)

        debug("move: " + msg.x + ", " + msg.y);
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
    console.log("");
    debug(`서버 켰다. 포트는 ${port}`);
});