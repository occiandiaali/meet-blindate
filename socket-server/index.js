const http = require("http");
const { Server } = require("socket.io");

/**
 * Class to track each connected player (id + position)
 */
class Player {
  constructor(id) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
}

const server = http.createServer();

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    // If you only want to allow PlayCanvas launch domain:
    // origin: "https://launch.playcanvas.com",

    // Or allow all origins (less secure, but quick for testing)
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const players = {};
let connectedUsers = new Set();
let countdown;
let interval = null;

/**
 * Handle new socket connections
 */
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle incoming audio stream
  socket.on("audioStream", (audioData) => {
    socket.broadcast.emit("audioStream", audioData);
  });

  // Fired when the client is ready to initialize their Player object
  socket.on("initialize", () => {
    if (Object.keys(players).length < 2) {
      const newPlayer = new Player(socket.id);
      players[socket.id] = newPlayer;
      socket.broadcast.emit("playerPlus", newPlayer);
      connectedUsers.add(socket.id);
      console.log("Connected Users ", connectedUsers);

      console.log("inside players ", players);

      console.log(`Players count: ${Object.keys(players).length}`);

      // Send to this client its own ID and the current list of players
      socket.emit("playerData", { id: socket.id, players });

      // Tell everyone else about this new player
      socket.broadcast.emit("playerJoined", newPlayer);
    } else {
      socket.emit("limited", "Three's a crowd, mate!");
      return;
    }

    if (connectedUsers.size === 2 && !interval) {
      interval = setInterval(() => {
        if (countdown > 0 && connectedUsers.size > 0) {
          countdown--;
          //  io.emit("timer", countdown);
          socket.broadcast.emit("timer", countdown);
        } else {
          //  io.emit("timer", 0);
          socket.broadcast.emit("timer", 0);
          //  io.emit("disconnectNotice", "Time's up or no users remaining.");
          socket.broadcast.emit("disconnectNotice", "Time's up.");

          clearInterval(interval);
          interval = null;
          countdown = 5;
          connectedUsers.clear();
        }
      }, 60000);
    }
  });

  socket.on("duration", (arg) => {
    console.log("<<<<<<Actual duration is>>>>>> ", arg);
    countdown = arg;
  });

  // Update player position
  socket.on("positionUpdate", (data) => {
    if (!players[socket.id]) return;
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    players[socket.id].z = data.z;

    // Broadcast updated position to all other players
    socket.broadcast.emit("playerMoved", {
      id: socket.id,
      x: data.x,
      y: data.y,
      z: data.z,
    });
  });

  socket.on("closeModal", (arg) => {
    delete players[arg];
    socket.disconnect();
    console.log("closingModal deletes ID ", arg);
    console.log(`Still in players: ${Object.keys(players).length}`);
    // Notify other players to remove this player
    socket.broadcast.emit("killPlayer", arg);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    if (!players[socket.id]) return;
    console.log("About to killPlayer ", players[socket.id]);
    delete players[socket.id];
    connectedUsers.delete(socket.id);
    console.log(`Still in players: ${Object.keys(players).length}`);
    // Notify other players to remove this player
    socket.broadcast.emit("killPlayer", socket.id);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Gold Succulent Server is now running on port ${PORT}`);
});
