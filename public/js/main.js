
const chatForm = document.getElementById('chat-form');

const chatMessages =document.querySelector('.chat-messages');

// Get username , room from using querystring 
const {username,room }=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);

const socket = io();

//Join chatroom
socket.emit('joinroom',{username,room});

//get room and users
socket.on('roomuser',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//MESSAGE FROM SERVER
socket.on('message',message =>{
    console.log(message);
     outputmsg(message);
     //Scroll down
     chatMessages.scrollTop = chatMessages.scrollHeight;

})

//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    // get the inputed msg
    const msg=e.target.elements.msg.value;
    
    //emitting msg
    socket.emit('chatMessage',msg);
    
    //emptying the message
    e.target.elements.msg.value="";
    e.target.elements.msg.value="";
});

function outputmsg(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class ="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div);
   
}

//add room name to Dom
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

function outputRoomName(room)
{
    roomName.innerText = room;
}


function outputUsers(users)
{
userList.innerHTML=`
${users.map(user =>`<li>${user.username}</li>`).join('')}`;
}