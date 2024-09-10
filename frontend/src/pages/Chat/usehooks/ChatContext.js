import React, {createContext, useState, useEffect} from "react";
import useFetch from "../../../hooks/useFetch.js";
import useAuth from "../../../hooks/useAuth.js";
// import {auth}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;

export const CurrentUserContext = createContext()

export const CurrentUserProvider = ({children}) =>{

const {data:CurrentUser} = useFetch(`${BACKEND_URL}/user/stats/`)
return (
    <CurrentUserContext.Provider value={CurrentUser}>
        {children}
    </CurrentUserContext.Provider>
)
}

export const blockPopUpContext = createContext()

export const BlockPopUpProvider = ({children}) =>{
  const [blockpopUp, setblockpopUp] = useState(false);

  return (
    <blockPopUpContext.Provider value={{blockpopUp: blockpopUp, setblockpopUp: setblockpopUp}}>
        {children}
    </blockPopUpContext.Provider>
)
}

export const clientSocketContext = createContext();

export const SocketClientProvider = ({children}) =>{
    const [socket, setsocket] = useState(null);
    const [botSocket, setbotSocket] = useState(null);
    const { auth } = useAuth();
    const [eventData , seteventReceived ] = useState(null);


  useEffect(() => {
    if (!auth.accessToken)
        return;
    const clientSocket = new WebSocket(`${WS_BACKEND_URL}/ws/chat/?token=${auth.accessToken}`);
    const forBotSocket = new WebSocket(`${WS_BACKEND_URL}/ws/chatbot/?token=${auth.accessToken}`)
    
    clientSocket.onopen = () => {
        setsocket(clientSocket);
        console.log(" WebSocket instanciated : onopen => Clunca ")
    };

    clientSocket.onclose = () => {
      console.log('WebSocket closed : onclose Clunca');
    };

    clientSocket.onerror = (error)=>{
      console.log('WebSocket error : Clunca socket : ', error);
    }

    // ****************************************************************************************
    forBotSocket.onopen = () => {
        setbotSocket(forBotSocket);
        console.log(" WebSocket instanciated : onopen => ChatBot ")
    };

    forBotSocket.onclose = () => {
      console.log('WebSocket closed : onclose ChatBot');
    };

    forBotSocket.onerror = (error)=>{
      console.log('WebSocket error : ChatBot socket : ', error);
    }
    forBotSocket.onmessage = (event) =>{
      const eventdata = JSON.parse(event.data);
      seteventReceived(eventdata)
    }
    // ****************************************************************************************
    return () => {
      if (socket)
        socket.close();
      
      if (botSocket)
        botSocket.close();
    
    };
  }, [auth.accessToken]);

    const socketstate ={
        stateValue : socket,
        socketsetter: setsocket,
        botSocket : botSocket,
        eventData: eventData
    }
    
return (
    <clientSocketContext.Provider value={socketstate}>
        {children}
    </clientSocketContext.Provider>
)
}
