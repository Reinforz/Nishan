const WebSocket = require("ws");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require('cors')

const app = express();
app.use(cors());

const wss = new WebSocket.Server({
  port: 8000
});

wss.on("connection", async (ws)=>{
  console.log("New client connected");

  ws.on("message", async(data)=>{
    console.log(`Client has sent ${data}`)
    ws.send("Server");
  });

  ws.on("close", async ()=>{
    console.log("Client has disconnected");
  })
});

const port = 3000;

app.get('/getPackages', async (req, res) => {
  const packages = await fs.promises.readdir(path.resolve(__dirname, "../../packages"));
  res.send(packages)
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})