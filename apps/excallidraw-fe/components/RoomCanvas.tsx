"use client";

import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token || "")}`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div className="flex items-center justify-center h-screen">
            Wait For a Moment 
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}