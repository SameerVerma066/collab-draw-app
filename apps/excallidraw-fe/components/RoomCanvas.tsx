"use client"


import { WS_URL } from "@/config";
import { initDraw } from "@/draw/shapes";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

 

export function RoomCanvas({roomId}: {roomId : string}){
    
    const[socket, setSocket]=useState<WebSocket | null >(null)
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTFjNDZhYy02MDIzLTQ2ZTEtOTViOC0yNTU5MzRlYzA0NjYiLCJpYXQiOjE3NTcxNzIzMjR9.l9q0JKq-PdkfIE5QEUJltxUjXBeGASKzTI-3a4qRDDseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTFjNDZhYy02MDIzLTQ2ZTEtOTViOC0yNTU5MzRlYzA0NjYiLCJpYXQiOjE3NTcxNzIzMjR9.l9q0JKq-PdkfIE5QEUJltxUjXBeGASKzTI-3a4qRDDs"/*hardcoded token value*/}`)
        ws.onopen = ()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    },[])

    

    if(!socket){
        return<div>
            connecting to server......
        </div>
    }

    return<div>
        <Canvas roomId={roomId} socket = {socket} />
    </div>
}