import { useEffect, useState } from "react";
import { storedToken, WS_URL } from "../config";


export function useSocket(){
    const[loading,setLoading]= useState(true);
    const[socket,setSocket]=useState<WebSocket>();
    
    useEffect(()=>{
        if (!storedToken) {
            setLoading(false);
            console.error("Authentication token not found.");//the stored token is called here
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);//the stored token is called here

        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws);  
        }
    },[]);
    return{
        socket,
        loading
    }
}