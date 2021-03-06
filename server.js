const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server).sockets;

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

let connectedUser = [];

io.on('connection', socket=>{
    console.log('connected');
    updateUserName();
    let userName= '';

    socket.on('login',(name,callback)=>{
        if(name.trim().length ===0){
            return;
        }
        callback(true);
        userName = name;
        connectedUser.push(userName);
        console.log(connectedUser);
        
        updateUserName();
    });

    socket.on('chat message', msg=>{
        io.emit('output',{
            name:userName,
            msg:msg
        });
    });

    socket.on('disconnect', ()=>{
        console.log('disconnected');
        connectedUser.splice(connectedUser.indexOf(userName),1);
        console.log(connectedUser);
        updateUserName();
    });
    
    function updateUserName(){
        io.emit('loadUser',connectedUser);
    }
});

const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`server running on port ${port}`));