const users=[];

//Join user to chat
function userJoin(id,username,room){
const user ={id,username,room};
users.push(user);

return user
}

// get the current user

function getCurrentuser(id){
   return users.find(user=>user.id==id);
}

//Users leaves chat
function userleaves(id){
    const index=users.findIndex(user =>user.id ===id);
    if(index !==-1){
        return users.splice(index,1)[0];
    }
}

// Get room users
function getroomusers(room){
    return users.filter(user=>user.room === room);
}

module.exports={
    userJoin,
    getCurrentuser,
    userleaves,
    getroomusers
};