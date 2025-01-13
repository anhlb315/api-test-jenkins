const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");

dotenv.config({
  path: "./config.env",
});

require("./src/services/s3Bucket");
require("./src/models/databaseIndex");

// Routes
const companyRoute = require("./src/routes/companyRoute");
const provinceRoute = require("./src/routes/provinceRoute");
const jobRoute = require("./src/routes/jobRoute");
const userRoute = require("./src/routes/userRoute");
const resumeRoute = require("./src/routes/resumeRoute");
const bookmarkRoute = require("./src/routes/bookmarkRoute");
const applyRoute = require("./src/routes/applyRoute");
const notificationRoute = require("./src/routes/notificationRoute");
const expectJobRoute = require("./src/routes/expectJobRoute");
const industryRoute = require("./src/routes/industryRoute");
const statisticRoute = require("./src/routes/statisticsRoute");
const chatRoute = require("./src/routes/chatRoute");
const tagRoute = require("./src/routes/tagRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/resources/publics`));

// Routes declaration
app.use("/api/companies", companyRoute);
app.use("/api/provinces", provinceRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/users", userRoute);
app.use("/api/resumes", resumeRoute);
app.use("/api/bookmarks", bookmarkRoute);
app.use("/api/applies", applyRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/expectations", expectJobRoute);
app.use("/api/industries", industryRoute);
app.use("/api/statistics", statisticRoute);
app.use("/api/chats", chatRoute);
app.use("/api/tags", tagRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const server = http.createServer(app);

const io = new Server(server, { cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected with socket id: ", socket.id);

  socket.on("addNewUser", (userId, companyId, role) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        companyId,
        role,
        socketId: socket.id,
      });

    console.log("onlineUsers: ", onlineUsers);
  });

  socket.on("applyForJob", (data) => {
    console.log("applyForJob: ", data);
    const { companyId } = data;
    const agentUserOnline = onlineUsers.find(
      (user) => user.companyId === companyId && user.role === "agent"
    );

    if (agentUserOnline) {
      io.to(agentUserOnline.socketId).emit("agentJobApply", {
        ...data,
      });
    }
  });

  socket.on("agentAcceptJobApply", (notificationObject) => {
    console.log("agentAcceptJobApply: ", notificationObject);
    const { sender_id, receiver_id } = notificationObject;
    const receiverUser = onlineUsers.find(
      (user) => user.userId === receiver_id && user.role === "user"
    );

    if (receiverUser) {
      io.to(receiverUser.socketId).emit(
        "userAcceptJobApply",
        notificationObject
      );
    }
  });

  socket.on("agentDenyJobApply", (notificationObject) => {
    console.log("agentDenyJobApply: ", notificationObject);
    const { sender_id, receiver_id } = notificationObject;
    const receiverUser = onlineUsers.find(
      (user) => user.userId === receiver_id && user.role === "user"
    );

    if (receiverUser) {
      io.to(receiverUser.socketId).emit("userDenyJobApply", notificationObject);
    }
  });

  socket.on("sendMessageNotification", (notificationObject) => {
    console.log("sendMessageNotification: ", notificationObject);
    const { sender_id, receiver_id } = notificationObject;
    const receiverUser = onlineUsers.find(
      (user) => user.userId === receiver_id
    );

    if (receiverUser) {
      io.to(receiverUser.socketId).emit(
        "receiveMessageNotification",
        notificationObject
      );
    }
  });

  socket.on("sendChatMessage", (chatObject) => {
    console.log("sendChatMessage: ", chatObject);
    const { sender_id, receiver_id } = chatObject;
    const receiverUser = onlineUsers.find(
      (user) => user.userId === receiver_id
    );

    if (receiverUser) {
      io.to(receiverUser.socketId).emit("receiveChatMessage", chatObject);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected with socket id: ", socket.id);
    console.log("onlineUsers: ", onlineUsers);
  });
});

server.listen(process.env.NODE_APP_PORT_NUMBER || 3001, () =>
  console.log(
    `Server is running in port ${process.env.NODE_APP_PORT_NUMBER || 3001}`
  )
);
