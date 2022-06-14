import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, OfficeState, Computer, Whiteboard } from './schema/OfficeState'
import { Message } from '../../types/Messages'
import { IRoomData } from '../../types/Rooms'
import { whiteboardRoomIds } from './schema/OfficeState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import {
  ComputerAddUserCommand,
  ComputerRemoveUserCommand,
} from './commands/ComputerUpdateArrayCommand'
import {
  WhiteboardAddUserCommand,
  WhiteboardRemoveUserCommand,
} from './commands/WhiteboardUpdateArrayCommand'
import ChatMessageUpdateCommand from './commands/ChatMessageUpdateCommand'
import { PostLobbyState } from './schema/PostLobbyState'
import { IPost } from '../../types/Post'
import {getPos,registerPost,deletePost,DisplayPost,modifyPostdb,registerComment,getComment,deleteComment,DisplayComment,modifyCommentdb} from '../DBController/PostController'
import {getId} from '../DBController/UserController'


export class PostLobby extends Room<PostLobbyState> {
  private dispatcher = new Dispatcher(this)
  

  async onCreate(options: IPost) {

    let hasPassword = false

    this.setState(new PostLobbyState())
    this.onMessage(Message.SEND_POSTS_REQUEST, (client, message: {}) => {
        
        // //로그인 db 호출
         getPos({}, (json)=>{
          
          client.send(Message.SEND_POSTS_RESPONSE, json );
          
        })
        
    })
    this.onMessage(Message.DUMP_IN, (client, message: {}) => {
        
        // //로그인 db 호출
          
          client.send(Message.DUMP_OUT, true );
        
    })
    this.onMessage(Message.REQ_POSTS_REGISTER, (client, message: { memberId: string, title: string, content: string,isNoti:string }) => {
        const { memberId, title, content,isNoti } = message
        getId({userIda:memberId},(result)=>{
            console.log('-------------------------------------');
            console.log(result);
            let Noti=0;
        if(isNoti==='1'){
            Noti=1;
        }else if(isNoti==='0'){
            Noti=0;
        }
            registerPost({DmemberId:result,Dtitle:title,Dcontent:content,DisNoti:Noti},(result)=>{
                console.log('---------------start----------------------');
                client.send(Message.RES_POSTS_REGISTER, result )
            })
        })
        
        
        
        
    })
    this.onMessage(Message.REQ_POSTS_DELETE, (client, message: { postId: number}) => {
        const { postId} = message
        console.log("In");
        console.log(postId);
        console.log(message);

        deletePost({postIdd:postId},(result)=>{
            client.send(Message.RES_POSTS_DELETE, result )
        })
        
    })
    this.onMessage(Message.REQ_POST_ONE, (client, message: { postId: number}) => {
        const { postId} = message
        console.log("In");
        console.log(postId);
        console.log(message);

        DisplayPost({postIdd:postId},(result)=>{
            console.log("out")
            client.send(Message.RES_POST_ONE, result )
        })
        
    })
    this.onMessage(Message.REQ_COMMENT_ONE, (client, message: { commentId: number}) => {
        const { commentId} = message
        console.log("In");
        console.log(commentId);
        console.log(message);

        DisplayComment({commentId:commentId},(result)=>{
            console.log("out")
            client.send(Message.RES_COMMENT_ONE, result )
        })
        
    })
    this.onMessage(Message.REQ_POSTS_MODIFY, (client, message: {title:string,content:string, id: number}) => {
        const { title,content,id} = message

        modifyPostdb({title:title,content:content, id: id},(result)=>{
            console.log("out")
            client.send(Message.RES_POSTS_MODIFY, result )
        })
        
    })
    this.onMessage(Message.REQ_COMMENT_MODIFY, (client, message: {id: number,content:string}) => {
        const { id,content} = message

        modifyCommentdb({id:id,content:content},(result)=>{
            console.log("out")
            client.send(Message.RES_COMMENT_MODIFY, result )
        })
        
    })
    this.onMessage(Message.REQ_COMMENT_REGISTER, (client, message: {user_id:string,content:string, post_id: number}) => {
        const { user_id,content,post_id} = message

        getId({userIda:user_id},(result)=>{
            console.log(result);
            registerComment({user_id:result,content:content,post_id:post_id},(result)=>{
                
                client.send(Message.RES_COMMENT_REGISTER, result )
            })
        })
    })
    this.onMessage(Message.REQ_COMMENT_LIST, (client, message: {post_id:number}) => {
        const { post_id} = message

        getComment({post_id:post_id},(result)=>{
            console.log(result);
            client.send(Message.RES_COMMENT_LIST, result )
        })
    })
    
    this.onMessage(Message.REQ_COMMENT_DELETE, (client, message: { commentId: number}) => {
        const { commentId} = message
        console.log("In");
        console.log(commentId);
        console.log(message);

        deleteComment({commentId:commentId},(result)=>{
            client.send(Message.RES_COMMENT_DELETE, result )
        })
        
    })
  }
  
  

  async onAuth(client: Client, options: { 
    
   }) {
  
    return true
  }

  onJoin(client: Client, options: any) {
    

  }

  onLeave(client: Client, consented: boolean) {
   
  }

  onDispose() {
   
  }
}
