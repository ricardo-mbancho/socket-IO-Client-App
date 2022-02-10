import React from 'react'; 
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";

let user = prompt("Please enter your name:", "Harry Potter");
let room = prompt("Please enter your room:", "bitches room");

const socket = io("https://fast-caverns-12899.herokuapp.com/", {
  // withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
 'query':{username:user,userRoom:room}
});

socket.on("connect", () => {
  // alert("Welcome back online ")
});
socket.emit("get db messages")


function App() {
  let [messages,setMessages]= React.useState([]); 
  
  let [input, setInput] = React.useState(""); 
  // let [onlineUsers,setOnlineusers] = React.useState([]) ;

  function handleSubmit() {
    socket.emit("message", input);

    setInput("")
  }


//  socket.on('get users', function(users) {
//    let filteredOnlineUsers= users.filter((user)=>user.username !== user  )
//   console.log(filteredOnlineUsers)
//    setOnlineusers(filteredOnlineUsers)
// }); 

React.useEffect(()=>{
  // if (messages.length === 0){
  //  socket.emit("get users", room);
  // }
socket.on('message', function(msg) {
    console.log("test")
    setMessages((prevMessages)=>{
      return [...prevMessages,{content:msg} ]
    })     
});

socket.on("get db messages", (messagesDb) => {
  console.log(messagesDb)
  if (messagesDb.length > 0 ){
  setMessages(messagesDb)
  }
});

socket.on("user joined", (username) => {
 alert(`${username} just joined` )
 console.log("user joined")
});

return ()=>{
  socket.off("message");
  socket.off("get db messages");
  socket.off("user joined")
};

},[])

  return (
    <div className="App">
       {/* <ul id="">
        {onlineUsers.map((onlineUser,i)=> <li key={`username ${i}}`}>{onlineUser.username}</li>)}
      </ul> */}
      <ul id="messages">
        {messages.map((message,i)=> <li key={`message ${i}}`}>{message.content}</li>)}
      </ul>
        <form id="form" action="" onSubmit={(event)=>  {
          event.preventDefault(); 
          handleSubmit()
          }}>
          <input value={input} onChange={(e)=>setInput(e.target.value)} id="input" autoComplete="off" /><button>Send</button>
        </form>
    </div>
  );
}

export default App;
