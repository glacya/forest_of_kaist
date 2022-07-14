const session = require('express-session');
const mysql_session = require('express-mysql-session');
const app = require('express')();
const path = require('path');

var cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const crypto = require('crypto');

const mysql = require('mysql');
const fs = require('fs');
const data = fs.readFileSync('./conf.json');
const conf = JSON.parse(data);

const cookieParser = require('cookie-parser');

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

const mysql_info = {
    host: conf.host,
    user: conf.user,
    password: conf.password,
    database: conf.database
};

const session_store = new mysql_session(mysql_info);

const connection = mysql.createConnection(mysql_info);

const ios = require('express-socket.io-session');
io.use(ios(session, {autoSave: true}));

app.use(cors());
app.use(cookieParser());
app.use(session({
    name: "session_cookie",
    secret: "hmmm",
    resave: false,
    saveUninitialized: false,
    store: session_store,
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


function debug(str) {
    var time = new Date();
    var t = time.toLocaleString();
    console.log(t + ": " + str);
}

function encrypt(password) {
    crypto.randomBytes(64, (error, buffer) => {
        const salt = buffer.toString('base64');
		crypto.pbkdf2(password, salt, 100, 64, 'sha512', (err, key) =>{
			return key.toString('base64');
		})
    })
}

// TEMP CODE: set rendering option to EJS
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // TODO: redirect to login page.
    // TODO: if login cookie exists, redirect to main game page.
    debug("GET /");
    if (req.session.is_logined === true) {
        debug("Already logged in.");
        res.redirect("http://localhost:3000/index.html");
    }
    else {
        debug("Not logged in, login please");
        res.redirect("/login.html");
    }
});

app.get("/register.html", (req, res) => {
    debug("GET /register.html");
    var id = req.query.id;
    var pw = req.query.pw;

    if (id != undefined && pw != undefined) {
        debug(`With id = ${id}, pw = ${pw}`);
        connection.query('select id from users where id=?', [id], (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Register failed due to query error.");
                res.redirect('/register.html');
            }
            else if (rows.length > 0) {
                debug(`User ID ${id} already exists.`);
                res.redirect('/register.html');
            }
            else {
                debug("OK, you can use this id..");
                connection.query('insert into users(id, pw) values(?, ?)', [id, pw], (error, rows, field) => {
                    if (error) {
                        // Query error again..
                        debug("Register failed due to query error...");
                        res.redirect('/register.html');
                    }
                    else {
                        debug(`User ${id} successfully registered.`);
                        res.redirect('/')
                    }
                })
            }
        })
    }
    else {
        res.sendFile(path.join(__dirname, "./test_register.html"));
    }
});


app.get("/login.html", (req, res) => {
    var id = req.query.id;
    var pw = req.query.pw;
    if (id != undefined || pw != undefined) {
        debug("query parameter: ID = " + req.query.id + ", PW = " + req.query.pw);
        connection.query('select * from users where id=? and pw=?', [id, pw], (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Login failed due to query error.");
                res.redirect('/');
            }
            else if (rows.length == 0) {
                debug("There are no such user, or password is incorrect.");
                res.redirect('/');
            }
            else {
                debug("Login success.");
                req.session.id = rows.id;
                req.session.is_logined = true;
                req.session.save(function() {
                    res.redirect('http://localhost:3000/index.html');
                })
            }
        })
    }
    else {
        res.sendFile(path.join(__dirname, "./test_login.html"));
    }
});


// main game.
// TODO: redirect to login page if not logged in.
// TODO: deliver page to user.
app.get("/game.js", (req, res) => {
    debug("hi");
})

io.on('connection', (socket) => {
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    debug(`IO: somebody entered: ${socket.handshake.session.id}`);

    socket.on("move", (msg) => {
        // MEMO: 'msg' contains variable sent from client.
        // In this case, msg would contain the followings:
        // - ID of the user
        // - position of the user (x, y)

        debug(`move: (${msg.x},\t${msg.y})`);
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
    debug(`Server is now on at port ${port}`);
});