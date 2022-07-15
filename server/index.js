const session = require('express-session');
const mysql_session = require('express-mysql-session');
const app = require('express')();
const path = require('path');
const util = require('util');

var cors = require('cors');

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

const random_bytes_promise = util.promisify(crypto.randomBytes);
const pbkdf2_promise = util.promisify(crypto.pbkdf2);

function debug(str) {
    var time = new Date();
    var t = time.toLocaleString();
    console.log(t + ": " + str);
}

const create_salt = async() => {
    const buffer = await random_bytes_promise(64);
    return buffer.toString("base64");
}

const hash_password = async(password) => {
    const salt = await create_salt();
    const key = await pbkdf2_promise(password, salt, 100, 64, "sha512");
    const hashed_pw = key.toString("base64");
  
    return { hashed_pw, salt };
};

const verify = async(user_pw, user_salt, answer) => {
    const key = await pbkdf2_promise(user_pw, user_salt, 100, 64, "sha512");
    const result = key.toString("base64");

    return result === answer;
}

// TEMP CODE: set rendering option to EJS
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // TODO: redirect to login page.
    // TODO: if login cookie exists, redirect to main game page.
    debug("GET /");
    if (req.session.is_logined === true) {
        debug("Already logged in.");
        res.cookie("id", req.session.id);
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
        debug(`With id = ${id}`);
        connection.query('select id from users where id=?', [id], async (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Register failed due to query error.");
                debug(error.message);
                res.redirect('/register.html');
            }
            else if (rows.length > 0) {
                debug(`User ID ${id} already exists.`);
                res.redirect('/register.html');
            }
            else {
                debug("OK, you can use this id..");
                const hashed_pw = await hash_password(pw);
                connection.query('insert into users(id, pw, salt) values(?, ?, ?)', [id, hashed_pw.hashed_pw, hashed_pw.salt], (error, rows, field) => {
                    if (error) {
                        // Query error again..
                        debug("Register failed due to query error...");
                        debug(error.message);
                        res.redirect('/register.html');
                    }
                    else {
                        debug(`User ${id}, ${hashed_pw.hashed_pw} successfully registered.`);
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
        debug("query parameter: ID = " + req.query.id);
        connection.query('select * from users where id=?', [id], async (error, rows, field) => {
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
                const user_info = rows[0];
                if (await verify(pw, user_info.salt, user_info.pw)) {
                    debug("Login success.");
                    req.session.id = rows.id;
                    req.session.is_logined = true;
                    req.session.save(function() {
                        res.cookie("id", id);
                        res.redirect('http://localhost:3000/index.html');
                    })
                }
                else {
                    debug("There are no such user, or password is incorrect.");
                    res.redirect("/");
                }
                
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
    debug(`IO: somebody entered`);

    socket.on("move", (msg) => {
        // MEMO: 'msg' contains variable sent from client.
        // In this case, msg would contain the followings:
        // - ID of the user
        // - position of the user (x, y)

        debug(`move: (${msg.pos.x},\t${msg.pos.y})`);
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
    
    socket.on("enter", (msg) => console.log(msg));
});

server.listen(port, function() {
    console.log("");
    debug(`Server is now on at port ${port}`);
});