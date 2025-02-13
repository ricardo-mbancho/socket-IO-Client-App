import React from 'react'; 
import './App.css';
import { io } from "socket.io-client";

const user = prompt("Please enter your name:", "Harry Potter");
const room = prompt("Please enter your room:", "bitches room");

const socket = io("https://fast-caverns-12899.herokuapp.com/", {
  extraHeaders: {
    "my-custom-header": "abcd"
  },
 'query':{username:user,userRoom:room}
});

socket.emit("get db messages")

function App() {
  const [messages,setMessages]= React.useState([]); 
  
  const [input, setInput] = React.useState(""); 
  // let [onlineUsers,setOnlineusers] = React.useState([]) ;

  function handleSubmit() {
    socket.emit("message", input);
    setInput("");
  }
  
  React.useEffect(()=>{
    socket.on('message', function(msg) {
      console.log("test")
      setMessages((prevMessages)=>{
        return [...prevMessages,{username:user, content:msg} ]
      });     
    });
    
    socket.on("get db messages", (messagesDb) => {
      if (messagesDb.length > 0 ){
      setMessages(messagesDb)
      }
    });
    
    socket.on("user joined", (username) => {
      alert(`${username} just joined` )
    });
    
    return ()=>{
      socket.off("message");
      socket.off("get db messages");
      socket.off("user joined")
    };

  },[]);

  return (
    <div className="App">
      <ul id="messages">
        {messages.map((message,i)=> {
          if (message){
            return (
              <div key={`message ${i}}`} className="container">
                <img src="/w3images/bandmember.jpg" alt={message.username}/>
                <p>{message.content}</p>
                <span className="time-right">11:00</span>
              </div>
            )
          }
          else {
            return(
              <div key={`message ${i}}`} class="container darker">
              <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right"  />
              <p>{message.content}</p>
              <span class="time-left">11:01</span>
            </div>
            )
          }
        })}
      </ul>
        <form id="form" action="" onSubmit={(event)=>  {
          event.preventDefault(); 
          handleSubmit()
          }}>
          <input 
            value={input} 
            onChange={(e)=>setInput(e.target.value)} 
            id="input" 
            autoComplete="off" 
          />
          <button>Send</button>
        </form>
    </div>
  );
}

export default App;
