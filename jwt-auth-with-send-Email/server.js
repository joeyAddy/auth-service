const dotEnv = require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

dotEnv.config({ path: "./env/config.env" });
const connection = require("./db/connection");
const app = require("./app");
const findMatch = require("./util/findMatch");
connection();

// Initializing express app, server and io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:19000",
    origin: "*",
    // methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A new client connected");

  // Event fired when a rider or traveler shares their details
  socket.on("share_details", async (data) => {
    console.log("shared_details");
    const matchedData = await findMatch(data, maxDistance);
  });

  const message = "welcome";

  io.emit("message", message);

  // Event fired when the client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.use(
  cors({
    origin: "*",
    // "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  })
);

const port = process.env.PORT || 3000;
// app.listen(port, () => {
server.listen(port, () => {
  console.log(`server is running on ${port} port!`);
});
