import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { LobbyState } from './schema/LobbyState'
import { IUser } from '../../types/Users'
import login from '../DBController/UserController'

export class Lobby extends Room<LobbyState> {
  private dispatcher = new Dispatcher(this)
  private id: string
  private password: string
  private result: boolean = false

  async onCreate(options: IUser) {
    let hasPassword = false
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
      login({id:this.id,password:this.password}, (user)=>{
        console.log('서버: 로그인 결과: '+user.result)
        // //클라이언트로 로그인 결과 전송
        client.send(Message.SEND_LOGIN_RESULT, {result: user.result} )
      })      
    })
  }

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
  }

  onDispose() {
  }
}
