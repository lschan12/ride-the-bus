import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import PartyButton from "./PartyButton"

type Props = {
  // state: any,
  // handleSelection: any,
  // handleOptions: any,
  player: string
}

const socket = io('http://localhost:3001' , {
  withCredentials: true,
  extraHeaders: {
    "controller": "abcd"
  }
})    
export default function PartyControls({player}:Props) {
  const [round, setRound] = useState(1)
  const [username, setUsername] = useState('')


  useEffect(() => {
    console.log('start')
    // socket.on('connect', ()=> console.log(socket.id))
    socket.on('connection', (socket)=> socket.join('game-room'))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect()
      ,5000)
    })   
    
    socket.on('round',(round)=> {
      console.log(round)
       setRound(round)
    })
    return ()=>{
      socket.disconnect()
    }

    
  }, [])

  const handleOptions = () => {
    switch (round) {
      case 1:
        return ["Red", "Black"];
      case 2:
        return ["Higher", "Lower"];
      case 3:
        return ["Inside", "Outside"];
      case 4:
        return ["Diamond", "Club", "Heart", "Spade"];
      default:
        return ["error", "error"];
    }
  };

  const option1 = handleOptions()[0];
  const option2 = handleOptions()[1];
  const option3 = handleOptions()[2];
  const option4 = handleOptions()[3];
  
  const sendPress = (player:string,choice:string) => {
    console.log('pressed')
    console.log(player,choice)
    socket.emit("buttonPress",player,choice)
  }
  const setUser = (username:string) => {
    console.log(username)
    socket.emit('setUser', username)
  }

  return(
    // <>
    // {<div className='flex flex-row justify-center'>
    //   <PartyButton option={option1} status={state.status} sendPress={sendPress} player={player}/>
    //   <PartyButton option={option2} status={state.status} sendPress={sendPress} player={player}/>
    //   {round===4 && <PartyButton option={option3} status={state.status} sendPress={sendPress} player={player}/>}
    //   {round===4 && <PartyButton option={option4} status={state.status} sendPress={sendPress} player={player}/>}
    //   </div>}
    // </>
      <>
      {<div className='flex flex-row justify-center'>
        <input placeholder="username" onChange={(e:any)=>setUsername(e.target.value)}>
        
        </input>
        <button onClick={()=>setUser(username)}>Submit Username</button>
        {username}
        <PartyButton option={option1} sendPress={sendPress} player={username}/>
        <PartyButton option={option2} sendPress={sendPress} player={username}/>
        {round===4 && <PartyButton option={option3} sendPress={username} player={username}/>}
        {round===4 && <PartyButton option={option4} sendPress={sendPress} player={username}/>}
        </div>}
      </>
  )
}