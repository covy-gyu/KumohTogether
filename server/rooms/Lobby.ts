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
import { LobbyState } from './schema/LobbyState'
import { IUser } from '../../types/Users'
import {login,getUse,deleteUser,displayOneUser,displayDepartId,modifyuser,getDepart} from '../DBController/UserController'

export class Lobby extends Room<LobbyState> {
  private dispatcher = new Dispatcher(this)
  private id: string
  private password: string
  private result: boolean = false

  async onCreate(options: IUser) {
    // const { id, password, result } = options
    // this.id = id
    // this.password = password
    // this.result = result

    let hasPassword = false
    // if (password) {
    //   // const salt = await bcrypt.genSalt(10)
    //   // this.password = await bcrypt.hash(password, salt)
    //   hasPassword = true
    // }
    // this.setMetadata({ id, password, result })

    this.setState(new LobbyState())

    //클라이언트에서 로그인 데이터를 받음
    this.onMessage(Message.SEND_LOGIN_DATA, (client, message: { id: string, password: string, result: boolean }) => {
      const { id, password, result } = message
      this.id = id
      this.password = password
      this.result = result
      
      const user:IUser ={
        id: message.id,
        password : message.password,
        result : false,
        msg : '',
        code: 0,
      }
      // //로그인 db 호출
      login({id:this.id,password:this.password}, (message,user)=>{
        console.log('서버: 로그인 결과: '+user.result+","+message)
        // //클라이언트로 로그인 결과 전송
        client.send(Message.SEND_LOGIN_RESULT, {identi:message,result: user.result})
      })
      

      // {
      //   console.log(user.result)
      //   client.send(Message.SEND_LOGIN_RESULT, {result: user.result} )
      // }
      
    })
    this.onMessage(Message.REQ_USER_lIST, (client, message: {}) => {
      
      getUse({in:'관리자'}, (users)=>{
        console.log(users)
        client.send(Message.RES_USER_lIST, users)
      })
      
      
    })
    this.onMessage(Message.REQ_DEPART_LIST, (client, message: {}) => {
      
      getDepart({}, (users)=>{
        console.log(users)
        client.send(Message.RES_DEPART_LIST, users)
      })
      
      
    })
    this.onMessage(Message.REQ_USER_DELETE, (client, message: { userid: number}) => {
      const { userid} = message
      console.log("In");
      console.log(userid);
      console.log(message);

      deleteUser({id:userid},(result)=>{
          client.send(Message.RES_USER_DELETE, result )
      })
      
  })
  this.onMessage(Message.REQ_USER_MODI, (client, message: {id: number, member_id:string, member_identification:string, member_name:string, member_nick:string,department_name:string}) => {
    const { id, member_id, member_identification, member_name, member_nick,department_name} = message
    displayDepartId({in:department_name}, (result)=>{
      modifyuser({ id:id, member_id:member_id, member_identification:member_identification, member_name:member_name, member_nick:member_nick,dapartment_id:result},(result2)=>{
        client.send(Message.RES_USER_MODI, result2 )
      })

    })
    
    
})
  this.onMessage(Message.REQ_USER_ONE, (client, message: { userid: number}) => {
    const { userid} = message
    console.log("In");
    console.log(userid);
    console.log(message);

    displayOneUser({in:userid},(result)=>{
        client.send(Message.RES_USER_ONE, result )
    })
    
})
  }

  


  
  //  getLogin(client:Client){
  //   const userData ={

  //   }


  //      //로그인 db 호출
  //      let loginResult = await login(userData, user)
  //       //클라이언트로 로그인 결과 전송
  //     client.send(Message.SEND_LOGIN_RESULT, {result: loginResult} )
  // }


  async onAuth(client: Client, options: { 
    id:string,
    password: string, 
    result: boolean,
    msg: string,
    code: number
   }) {
  
    return true
  }

  onJoin(client: Client, options: any) {
    const { id, password, result } = options
    this.id = id
    this.password = password
    this.result = result

    this.setMetadata({ id, password, result })

  }

  onLeave(client: Client, consented: boolean) {
    // if (this.state.players.has(client.sessionId)) {
    //   this.state.players.delete(client.sessionId)
    // }
    // this.state.computers.forEach((computer) => {
    //   if (computer.connectedUser.has(client.sessionId)) {
    //     computer.connectedUser.delete(client.sessionId)
    //   }
    // })
    // this.state.whiteboards.forEach((whiteboard) => {
    //   if (whiteboard.connectedUser.has(client.sessionId)) {
    //     whiteboard.connectedUser.delete(client.sessionId)
    //   }
    // })
  }

  onDispose() {
    // this.state.whiteboards.forEach((whiteboard) => {
    //   if (whiteboardRoomIds.has(whiteboard.roomId)) whiteboardRoomIds.delete(whiteboard.roomId)
    // })

    // console.log('room', this.roomId, 'disposing...')
    // this.dispatcher.stop()
  }
}
