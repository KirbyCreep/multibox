import { WebSocketServer } from 'ws';
import { createServer } from 'http';
const server = createServer();
const wss = new WebSocketServer({ server });
var clusters = {}
var serverId = []
wss.on('connection', function connection(ws) {
  ws.send("connected")
  ws.on('message', function message(data) {
    var maintenance = false;
    if(maintenance) {
       ws.send("broadcast@[SERVER] - Server is currently being updated! Please check back later.")
        return;
    }
    console.log('[RECIEVER] Recieved Command: %s', data);
    try {
      
    var command = data.toString().split("@");
    // commands from client
		switch(command[0]) { 
     
      case "init":
      var room = command[1];
      var user = command[2];
      if(clusters[room] != undefined)  {
        
        clusters[room]["sockets"].push(ws);
        clusters[room]["users"].push(user);
        ws.send("download@" + clusters[room]["hash"]+"@new");
       
      } else {
        clusters[room] = { "sockets": [ws], "users": [user], "hash": null}
        ws.send("getData")
      }
        var roomSockets = clusters[room]["sockets"];
        var roomUsers = clusters[room]["users"];
        for (var i = 0; i< roomSockets.length; i++) {
         
            console.log("[USER JOIN] Synchronizing User - " + roomUsers[i])
             roomSockets[i].send("broadcast@" + "[SERVER] > "+ user + " has joined the server. ");
          roomSockets[i].send("broadcast@" + "[SERVER] > "+ " IT FUCKING WORKS BABYYYYY ");
        }
    break;
      case "upload":
        var room = command[1];
        var user = command[2];
        var hash = command[3];

        clusters[room]["hash"] = hash;
        var roomSockets = clusters[room]["sockets"];
        var roomUsers = clusters[room]["users"];
        for (var i = 0; i< roomSockets.length; i++) {
         
            console.log("[UPLOAD] Synchronizing user " + roomUsers[i])
             roomSockets[i].send("download@" + clusters[room]["hash"]);
          
        }
      break;
      case "disconnect":
         var room = command[1];
        var user = command[2];
        
       
        var roomSockets = clusters[room]["sockets"];
        var roomUsers = clusters[room]["users"];
        for (var i = 0; i< roomSockets.length; i++) {
         
            console.log("[USER LEAVE] Synchronizing User - " + roomUsers[i])
             roomSockets[i].send("broadcast@" + "[SERVER] > "+ user + " has left like your dad getting milk haha gottem. ");
        }
        break;
      case "chat":
        var room = command[1];
        var user = command[2];
        var message = command[3];
      
        var roomSockets = clusters[room]["sockets"];
        var roomUsers = clusters[room]["users"];
        for (var i = 0; i< roomSockets.length; i++) {
         
            console.log("[CHAT] Synchronizing User - " + roomUsers[i])
             roomSockets[i].send("broadcast@" + "["+user+"] > "+ message);

          
        }
        break;
      break;
    }
    } catch(e) {
      console.log("Caught an exception! Trace: " + e)
    }
    
    //end of commands from client
  });

  ws.send('something');
});

server.listen(8080);