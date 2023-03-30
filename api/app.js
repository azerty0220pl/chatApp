const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const passportSocketIo = require('passport.socketio');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const dbMan = require('./scripts/databaseMan.js');
const auth = require('./scripts/auth.js');
const routes = require('./scripts/routes.js');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  key: 'express.sid',
  store: store
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

dbMan.connect.then(() => {
  auth();
  routes(app);

  io.on('connection', (socket) => {

    if(chats.state == "success") {
      socket.join(socket.request.user.username);
      socket.emit('joined');
    } else {
      socket.emit('error');
    }

    io.on('message', (data) => {
      let x = dbMan.sendMessage(data.from, data.to, data.message);
      socket.emit('sent', {status: x.status});
      io.to(data.to).emit('message', data);
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