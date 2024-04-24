import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const URL = process.env.FRONT_URL;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const shapes: Record<string, any> = {
  room1: [],
  room2: [],
  room3: [],
  room4: [],
  room5: [],
  room6: [],
  room7: [],
  room8: [],
};
const users_data: Record<string, Record<string, any>> = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.join("preview");
  console.log("sending preview", shapes);
  io.in(socket.id).emit("preview", shapes);
  socket.on("join room", (room: string) => {
    if (!(room in shapes)) return;
    socket.leave("preview");
    socket.join(room);
    socket.emit("joined room", room);
  });

  socket.on("get initial preview", () => {
    console.log("sending preview", shapes);
    io.in(socket.id).emit("initial preview", shapes);
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    Object.keys(users_data).forEach((room) => {
      delete users_data[room][socket.id];
    });
  });

  socket.on("leaveroom", (room) => {
    console.log("leaving room", room);
    socket.leave(room);
    socket.join("preview");
  });

  socket.on("initial shapes", (room) => {
    io.in(socket.id).emit("initial shapes", shapes[room]);
  });

  socket.on("new shape", async (room, shape) => {
    console.log("adding new shape", room, shape);
    if (!shapes[room]) return;
    shapes[room].push(shape);
    socket.to(room).emit("add new shape", shape);
    io.in("preview").emit(`update preview ${room}`, shape);
  });

  socket.on(
    "broadcast user",
    (room, { user_id, username, pos, shape, color }) => {
      console.log("broadcating user");
      if (!users_data[room]) users_data[room] = {};
      if (user_id) users_data[room][user_id] = { username, pos, shape, color };
      io.in(room).emit("broadcast users", users_data[room]);
    },
  );
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
