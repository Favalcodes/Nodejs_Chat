import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import bodyParser from "body-parser";

// Mongodb
import '../config/mongo.js'

import webSocket from "../utils/webSocket.js";

// controller
import chatroom from '../controllers/chatroom.js'

// routes
import indexRouter from "../routes/index.js";
import userRouter from "../routes/user.js";
import chatRoomRouter from "../routes/chatrooms.js";
// middlewares
import { decode } from '../middlewares/jwt.js'

const app = express();

/** Get port from environment and store in Express. */
const port = process.env.PORT || "3000";
app.set("port", port);
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("../views/index")
})
app.get('/welcome', chatroom.getAllRooms)
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.io = new Server(server);
global.io.on('connection', webSocket.connection)
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});