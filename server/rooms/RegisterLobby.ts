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
import { RegisterLobbyState } from './schema/RegisterLobbyState'
import { IMember } from '../../types/Members'
import {register,displayDepartId} from '../DBController/UserController'

export class RegisterLobby extends Room<RegisterLobbyState> {
  private dispatcher = new Dispatcher(this)
  private id: string
  private password: string
  private identification: string
  private name: string
  private nickname: string
  private socialNum: string
  private department: string

  async onCreate(options: IMember) {
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

    this.setState(new RegisterLobbyState())

    this.onMessage(Message.SEND_MEM_REGISTER_DATA, (client, message: { id: string, password: string, identification: string,name: string,nickname: string,socialNum: string, department: string}) => {
      const { id, password, identification, name,nickname,socialNum,department} = message
      this.id = id
      this.password = password
      this.identification = identification
      this.name = name
      this.nickname = nickname
      this.socialNum = socialNum
      this.department = department
      console.log("message");
      console.log(message);
      
      
      const member:IMember ={
        id: message.id,
        password : message.password,
        identification:message.identification,
        name:message.name,
        nickname:message.nickname,
        socialNum:message.socialNum,
        department:'',
        result : false,
      }
      displayDepartId({in:department}, (result2)=>{
        console.log(result2);
        register({id:this.id , password:this.password , identification:this.identification , name:this.name,nickname:this.nickname,socialNum:this.socialNum,department:result2}, (result)=>{
          console.log('서버: 로그인 결과: '+member.result)
          // //클라이언트로 로그인 결과 전송
          client.send(Message.SEND_MEM_REGISTER_Result, {result: result} )
      })
      // //로그인 db 호출
      
      
  
      // {
      //   console.log(user.result)
      //   client.send(Message.SEND_LOGIN_RESULT, {result: user.result} )
      // }
      
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
    const { id, password, identification, name,nickname,socialNum,department} = options
    this.id = id
      this.password = password
      this.identification = identification
      this.name = name
      this.nickname = nickname
      this.socialNum = socialNum
      this.department = department

    this.setMetadata({ id, password, identification, name,nickname,socialNum,department })

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
