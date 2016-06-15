// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
app.use(express.static(__dirname));


app.get('/', function(req, res){
  res.sendfile('./index.html');
});


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var clients = new Array(); 

io.on('connection', function(socket){
     var addedUser = false;
   
  socket.on('chat message', function(msg,number){
    
        var index = clients.indexOf(socket.username); 
        if(index > -1) 
        {
           
            console.log(socket.username + " answered on questeion " + number + ": " + msg);
            socket.broadcast.emit('new message', {
      username: socket.username,
      message: msg
    });
        }
      
  });
    
    socket.on('disconnect', function () {
    
        var index = clients.indexOf(socket.username); 
        if(index > -1) 
        {
            clients.splice(index, 1);
        }
        console.log('user left:' + socket.username); 
        console.log('clients: ' + clients);
        // echo globally that this client has left
    
    
  });
     socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
         var index = clients.indexOf(socket.username); 
         if(index > -1){ 
             clients[index] = socket.username;}
         else{
             clients.push(socket.username);
              
         }
         
    addedUser = true;
         console.log(socket.username + " joined"); 
            console.log('clients: ' + clients);
    socket.emit('login', {
     
    });
         
          socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    isocket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
});
});
