import { WS_URL } from "@/config";
import { initDraw } from "@/draw/shapes";

import { useEffect, useRef } from "react";

export function Canvas({roomId, socket}:{roomId : string, socket: WebSocket }){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=> {

        if (canvasRef.current){
            const canvas = canvasRef.current;
           // const socket = new WebSocket(WS_URL);//Created a WebSocket in Canvas.tsx and pass it to initDraw (and clean it up). Also import the URL.
           initDraw(canvasRef.current, roomId ,socket)
        }
    }, [canvasRef]);

    return<div>
    <canvas ref = {canvasRef} width={2000} height={1000}></canvas>
</div>
}