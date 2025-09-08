"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/router";


export default function Home() {
  const [roomId,setroomId] = useState("");
  const router = useRouter();

  return (
   <div className={styles.page}>
    <input value={roomId} onChange={(e)=> {
      setroomId(e.target.value);
    }}type="text"placeholder="Room Id"></input>
    <button onClick={()=>{
      router.push(`/room/{$roomId}`);
    }}>Join Room</button>
   </div>
  );
}
