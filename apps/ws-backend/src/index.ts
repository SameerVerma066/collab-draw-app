import { WebSocket, WebSocketServer } from 'ws';
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });
//state-management using global variable 
interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];



const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // better way to get away from the type error instead of defining it as a jwtPayload in decode

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
 
};

wss.on('connection', function connection(ws, request) {
  const url = request.url;

  if (!url){
    return;
  }
  const queryParams = new URLSearchParams(url.split ('?')[1]);
  const token = queryParams.get('token')|| "";

  const userId = checkUser(token);

  if(!userId ){
    ws.close;
    return ;
  }



  ws.on('message', async function message(data) {
      // const parsedData = JSON.parse(data as unknown as string);
      let parsedData;
      if(typeof data !== "string"){
        parsedData = JSON.parse(data.toString());
      }else{
        parsedData= JSON.parse(data);
      }
      // const parsedData = JSON.parse(data.toString());
      
      
      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user?.rooms.filter((x) => x === parsedData.room);
      }

      if (parsedData.type === "chat") {
        //TODO: check if the message isn't too long; also check if the message doesnot have something abnoxious written in it
  
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.chat.create({
          data:{
            roomId: Number(roomId),
            message,
            userId
          }
        });

        users.forEach(user => {
          if (user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
              type :"chat",
              message: message,
              roomId
            }))};
        })
      }
  });

});