import { 
   ConnectedSocket,
   MessageBody, 
   OnGatewayConnection, 
   OnGatewayDisconnect, 
   SubscribeMessage, 
   WebSocketGateway, 
   WebSocketServer } 
   from "@nestjs/websockets";
import {Socket,Server} from 'socket.io'
import { Client } from "socket.io/dist/client";

@WebSocketGateway(3002,{cors:{origin:"*"}})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{
 
     @WebSocketServer() server:Server;
     handleConnection(client:Socket){
        console.log('New user Connected', client.id);
        
        client.broadcast.emit('user-joined',{
            message:`New User Joined the Chat : ${client.id}`,
        })
      
     }
     handleDisconnect(client: Socket) {
         console.log("User Disconnected",client.id);
         this.server.emit('user-left',{
            message:`User left the Chat : ${client.id}`,
     })
    }

    @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message', {
      message:payload.message,
      username:payload.username,
      senderId: client.id,
    });
  }
}
