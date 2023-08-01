const express = require('express');
const path = require('path');
const http =require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin,getCurrentuser,userleaves,getroomusers}=require('./utils/users');
// const mongoose = require("mongoose");


const botname = 'chatcord bot';
const app=express();
const server=http.createServer(app);

 const io = socketio(server);

 //RUN THE CONNECTION
 io.on('connection',(socket)=>{
  socket.on('joinroom',({username,room})=>{
    console.log(`connected`);
    
    const user=userJoin(socket.id,username,room);
    socket.join(user.room);
   
    //NEW USER ENTER INTO OUR APPLICATION
  socket.emit('message',formatMessage(botname,'Welcome'));
  
  // SAYING TO EVERYONE EXCEPT USER THAT NEW USER HAS ARRIVED
  socket.broadcast
    .to(user.room) 
    .emit('message',formatMessage(botname,`${user.username} has joined the chat`));


    //send users and room info
    io.to(user.room).emit('roomuser',{
        room:user.room,
        users:getroomusers(user.room)
    });

});

    //CLIENT ENTERED DATA
    socket.on('chatMessage',(msg)=>{
        console.log(msg);
        const user=getCurrentuser(socket.id);
        io.emit('message',formatMessage(user.username,msg));
    })

   // WHEN A USER LEFT THEN DISPLAYING TO EVERYONE THAT USER LEFT
      socket.on('disconnect',()=>{
        const user =userleaves(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`));
        }

        io.to(user.room).emit('roomuser',{
            room:user.room,
            users:getroomusers(user.room)
        });
        
      console.log("left");
})
 });

app.use(express.static(path.join(__dirname,'public')));
const port=3000 || process.env.port

server.listen(port,()=>{
    console.log(`this is started in ${port}`);
})

