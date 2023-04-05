const express = require('express');
const bodyParser = require('body-parser')
const  http = require('http');
const  cors = require('cors');
const  passportSocketIo = require('passport.socketio');
const  session = require('express-session');
const  cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const dbMan = require('./scripts/databaseMan.js');
const auth = require('./scripts/auth.js');
const routes = require('./scripts/routes.js');
const passport = require('passport');

const app = express();
const server = http.createServer(app);
//cors.SupportsCredentials = true;
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: 'https://azerty0220pl.github.io',
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    sameSite: 'none',
    secure: true
  },
  key: 'express.sid'
}));
/*app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://azerty0220pl.github.io');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});*/
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

db = new dbMan.dbMan();
db.connect().then(() => {
  console.log("connected to database");
  auth.auth(db);
  routes.routes(app, db);

  io.on('connection', (socket) => {

    if(chats.state == "success") {
      socket.join(socket.request.user.username);
      socket.emit('joined');
    } else {
      socket.emit('error');
    }

    io.on('message', (data) => {
      db.sendMessage(data.from, data.to, data.message).then(x => {
        socket.emit('sent', {status: x.status});
        io.to(data.to).emit('message', data);
      }).catch(err => {
        socket.emit('not sent', {status: "error", message: err});
      });
    });
  });
}).catch((err) => {
  console.log("Unable to connect to database: " + err)
});

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  console.log('failed connection', message);
  accept(null, false);
}

server.listen(5000, () => 'Server is running on port 4000');