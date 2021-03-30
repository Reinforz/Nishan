const WebSocket = require("ws");
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



