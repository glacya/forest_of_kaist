const session = require('express-session');
const mysql_session = require('express-mysql-session');
const express = require('express');
const app = express();
const path = require('path');
const util = require('util');
const objects = require('./utils/objects');
const Cache = require('./utils/cache').Cache;
const Point = objects.Point;
const Building = objects.Building;
const Users = require('./utils/user').Users;
const encrypt = require('./utils/encrypt');
const hash_password = encrypt.hash_password;
const verify = encrypt.verify;
const Money = require('./utils/money').Money;
const Others = require('./utils/others').Others;

var cors = require('cors');

const mysql = require('mysql');
const fs = require('fs');
const data = fs.readFileSync('./conf.json');
const conf = JSON.parse(data);

const cookieParser = require('cookie-parser');

const server = require('http').createServer(app);
const port = process.env.PORT || 80;
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost", "http://localhost:3000", "http://localhost:3001", "http://localhost:53469"],
        methods: ["GET", "POST"]
    },
    transports: [
        'websocket'
    ],
    upgrade: false
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
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function debug(str) {
    var time = new Date();
    var t = time.toLocaleString();
    console.log(t + ": " + str);
}

var cache = new Cache();
var users = new Users();
var money = new Money();
var others = new Others();

// Just redirect.. but it does not work because it uses port 3000
app.get("/", (req, res) => {
    res.redirect("http://192.249.18.201:3000");
});

// Handle registration of user. This should be used.
app.post("/register", (req, res) => {
    debug("POST /register");
    var id = req.body.id;
    var pw = req.body.pw;

    if (id != undefined && pw != undefined) {
        debug(`With id = ${id}`);
        connection.query('select id from users where id=?', [id], async (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Register failed due to query error 1");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if (rows.length > 0) {
                debug(`User ID ${id} already exists.`);
                res.status(400).send("The ID already exists.");
            }
            else {
                debug("OK, you can use this id..");
                const hashed_pw = await hash_password(pw);
                connection.query('insert into users(id, pw, salt) values(?, ?, ?)', [id, hashed_pw.hashed_pw, hashed_pw.salt], (error, rows, field) => {
                    if (error) {
                        // Query error again..
                        debug("Register failed due to query error 2");
                        debug(error.message);
                        res.status(400).send(error.message);
                    }
                    else {
                        debug(`User ${id}, ${hashed_pw.hashed_pw} successfully registered.`);
                        // Redirect to login page.
                        res.status(200).send("Register succeeded.");
                    }
                })
            }
        })
    }
    else {
        res.status(400).send("Bad request body; you must include id and pw.");
    }
})

// Handles login of user.
app.post("/login", (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    debug("POST /login");
    if (id != undefined && pw != undefined) {
        connection.query('select * from users where id=?', [id], async (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Login failed due to query error.");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if (rows.length == 0) {
                debug("There is no such user, or password is incorrect.");
                res.status(400).send("There is no such user, or password is incorrect.");
            }
            else {
                const user_info = rows[0];
                if (await verify(pw, user_info.salt, user_info.pw)) {
                    debug("Login success.");
                    req.session.id = rows.id;
                    req.session.is_logined = true;
                    req.session.save(function() {
                        res.status(200).send("Login succeeded.");
                    })
                }
                else {
                    debug("There is no such user, or password is incorrect.");
                    res.status(400).send("There is no such user, or password is incorrect.");
                }
            }
        });
    }
    else {
        res.status(400).send("Bad request body; you must include id and pw.");
    }
});



// Update money every 10 seconds.
const autoIncrementMoney = setInterval(function() {
    io.emit("updateMoney", money.gainBaseIncome());
    io.emit("displayMoney", {
        amount: money.getBaseIncome(),
        pos: {x: 53.0, y: 50.0}
    });
}, 10000);

// Update goose movements 30 times per second.
const updateGeeseMovement = setInterval(function() {
    others.moveGeese();
    users.user_info.forEach((user, id) => {
        const socket = users.getSocket(id);
        const others_list = others.getDiff(user);
        if ((others_list.add.length > 0) || (others_list.move.length > 0) || (others_list.delete.length > 0)) {
            io.to(socket).emit("updateOthers", others_list);
        }
    });
}, 33);

// Generate goose every 5 seconds.
const spawnGoose = setInterval(function() {
    const result = others.generateGoose();
    if (result != undefined) {
        // console.log("Generated goose!!");
        users.user_info.forEach((user, id) => {
            const socket = users.getSocket(id);
            const others_list = others.getDiff(user);
            if ((others_list.add.length > 0) || (others_list.move.length > 0) || (others_list.delete.length > 0)) {
                io.to(socket).emit("updateOthers", others_list);
            }
        })
    }
}, 5000);


// Handle client.
io.on('connection', (socket) => {
    debug('IO: somebody entered');

    socket.on("enter", (user) => {
        // Assign user ID.
        debug("User entered.");
        const user_temp_id = users.assign();
        cache.setDefaultUserLocation(user_temp_id);
        const init_object_list = cache.getObjectList({x: 49, y: 49});
        const init_msg = {
            id: user_temp_id,
            objList: {
                add: init_object_list,
                delete: []
            }
        };
        socket.emit("welcome", init_msg);
        // console.log(init_object_list);
        // console.log(socket.id);
    
        user.id = user_temp_id;

        // Notify other users.
        // This event causes message only.
        io.emit("newUser", user);

        const result = cache.getDiff(user);
        result.add.push(user);
        // console.log(result);
        socket.emit("setObjList", result);
        socket.emit("updateMoney", money.getCurrentMoney());
        socket.broadcast.emit("anotherUser", {
            type: "add",
            user: user
        });
        users.setSocket(user_temp_id, socket.id);
        users.setUserInfo(user);

        const init_neighbors = users.updateNeighbors(user);

        init_neighbors.forEach((action) => {
            socket.emit("anotherUser", {type: "add", user: users.getUser(action.target)});
        })

        // On updateUnit: returns set of objects (excluding characters) that should be added or deleted.
        socket.on("updateUnit", (msg) => {
            // MEMO: 'msg' contains variable sent from client.
            // In this case, msg is 'ObjectClass'. I would use..
            // - ID of the user
            // - position of the user (x, y)
    
            // console.log(`updateUnit: ${msg.id} (${msg.pos.x},${msg.pos.y})`);
    
            var result = cache.getDiff(msg);

            // console.log(result);
            const others_list = others.getDiff(msg);
            if ((others_list.add.length > 0) || (others_list.move.length > 0) || (others_list.delete.length > 0)) {
                socket.emit("updateOthers", others_list);
            }

            // const new_neighbors = users.updateNeighbors(msg);
            // new_neighbors.forEach((item) => {
            //     var type = item.type;
            //     if (type == "add") {
            //         result.add.push(item.user);
            //     }
            //     else if (type == "delete") {
            //         result.delete.push(item.user);
            //     }
            // })
            
            // Emit information to the user whom sent move information.
            // Result contains two fields: {add: [], delete: []}
            socket.emit("updateObjList", result);
            
        });

        // On move: updates neighbor list of users and send update message.
        socket.on("move", (user) => {
            // Emit position to every client connected to the server.
            // The clients will take care of movements.
            users.setUserInfo(user);
            const emit_list = users.updateNeighbors(user);
            // console.log("move of user " + user.id);

            emit_list.forEach((item) => {
                const socket_id = users.getSocket(item.target);
                // console.log(`User ${user.id} sends ${item.type} to User ${item.target}`);
                const repacked_item = {type: item.type, user: user};
                io.to(socket_id).emit("anotherUser", repacked_item);
                // console.log("anotherUser(): " + item.type);
                if (item.type == "add" || item.type == "delete") {
                    socket.emit("anotherUser", {
                        type: item.type,
                        user: users.getUser(item.target)
                    });
                }
            });
        });

        // Interaction on objects when pressing spacebar.
        socket.on("interaction", (object_list) => {
            if (object_list.length > 0) {
                // TODO: enhance algorithm of selecting target object.
                const target_object = object_list[0];

                const user_id = users.getUserIdFromSocket(socket.id);
                const user = users.getUser(user_id);

                switch (target_object.type) {
                    case "goose":
                        const goose_value = others.gooseValue();
                        money.gainMoney(goose_value);
                        // console.log("target_object = ", JSON.stringify(target_object));
                        io.emit("updateOthers", {
                            add: [],
                            move: [],
                            delete: [target_object]
                        });
                        others.removeGoose(target_object.id);
                        io.emit("updateMoney", money.getCurrentMoney());
                        socket.emit("displayMoney", {
                            amount: goose_value,
                            pos: target_object.pos
                        });
                        break;
                    default:
                        console.log("todo.");
                        break;
                }
            }
        });

        socket.on("clickGround", (msg) => {
            const amount = msg.amount;
            const pos = msg.pos;
            const new_money = money.gainMoney(amount);
            // console.log(`clickGround: users have ${new_money} now`);
            io.emit("updateMoney", new_money);
            socket.emit("displayMoney", msg);
        });

        socket.on("disconnect", (reason) => {
            const current_user = users.cleanUp(socket.id);
            io.emit("anotherUser", {type: "delete", user: current_user});
        });
    });
});

server.listen(port, function() {
    console.log("");
    debug(`Server is now on at port ${port}`);
});