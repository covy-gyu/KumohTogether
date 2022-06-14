import { Client, Room } from 'colyseus.js'
import { IComputer, IOfficeState, IPlayer, IWhiteboard } from '../../../types/IOfficeState'
import { ISquareState } from '../../../types/ISquareState'
import { ILobbyState } from '../../../types/ILobbyState'
import { IRegisterMem } from '../../../types/IRegisterMem'
import { IPostState } from '../../../types/IPostState'
import { ILectureVideoListState } from '../../../types/ILectureVideoListState';
import { Message } from '../../../types/Messages'
import { IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import { IUser } from '../../../types/Users'
import WebRTC from '../web/WebRTC'
import { phaserEvents, Event } from '../events/EventCenter'
import store from '../stores'
import {
  setSessionId,
  setPlayerNameMap,
  removePlayerNameMap,
  setLoggedSuccess,
} from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from '../stores/ChatStore'
import { setWhiteboardUrls } from '../stores/WhiteboardStore'
import { openSquare } from '../stores/DoorStore'
import { IPost } from '../../../types/Post'
import { IComment } from '../../../types/Comment'
import { IMember } from '../../../types/Members'
import { IMemberModi } from '../../../types/MemberModi'
import { ILectureVideo } from '../../../types/LectureVideo'

export default class Network {
  private client: Client
  private room?: Room<IOfficeState>
  private lobby!: Room<ILobbyState>
  private square?: Room<ISquareState>
  private registerLobby!: Room<IRegisterMem>
  private postLobby!: Room<IPostState>
  private lectureVideoLobby!: Room<ILectureVideoListState>
  scene!: string
  webRTC?: WebRTC

  mySessionId!: string

  private protocol: string
  private endpoint: string
  constructor() {
    this.protocol = window.location.protocol.replace('http', 'ws')
    this.endpoint =
      process.env.NODE_ENV === 'production'
        ? `wss://sky-office.herokuapp.com`
        : `${this.protocol}//${window.location.hostname}:2567`
    this.client = new Client(this.endpoint)
    this.scene = 'lobby'
    this.joinLobbyRoom().then(() => {
      store.dispatch(setLobbyJoined(true))
    })
 

  }
  setInit() {
    console.log('set init')

  }

  /**
   * method to join Colyseus' built-in LobbyRoom, which automatically notifies
   * connected clients whenever rooms with "realtime listing" have updates
   */
  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
    this.lobby.onMessage('rooms', (rooms) => {
      store.dispatch(setAvailableRooms(rooms))
    })

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  // method to join the public lobby
  async joinOrCreatePublic() {
    this.scene = 'game'
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC)
    this.client = new Client(this.endpoint)
    this.mySessionId = this.room.sessionId
    store.dispatch(setSessionId(this.room.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)
    this.initialize()
  }

  // method to join the square
  async joinOrCreateSquare() {
    this.scene = 'square'
    this.square = await this.client.joinOrCreate(RoomType.SQUARE)
    this.client = new Client(this.endpoint)
    this.mySessionId = this.square.sessionId
    store.dispatch(setSessionId(this.square.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)

    this.squareInit()
  }

  // method to join a custom room
  async joinCustomById(roomId: string, password: string | null) {
    this.room = await this.client.joinById(roomId, { password })
    this.initialize()
  }

  // method to create a custom room
  async createCustom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.CUSTOM, {
      name,
      description,
      password,
      autoDispose,
    })
    this.initialize()

  }

  // 로그인 정보 db조회를 위해 서버로 메시지 전송
  async tryLogin(loginData: IUser, callback: (logindata:string,loginSuccess: boolean) => void) {
    const { id, password, result, msg, code } = loginData
    // let loginResult: boolean = false
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)

    //서버로 로그인 데이터 전송
    this.lobby.send(Message.SEND_LOGIN_DATA, {
      id: loginData.id,
      password: loginData.password,
      result: loginData.result,
    })
    //서버에서 로그인 결과를 받음
    this.lobby.onMessage(Message.SEND_LOGIN_RESULT, (message: {identi:string, result: boolean }) => {
      console.log('클라: 로그인 결과: ' + message.result)
      if (message.result === true) {
        store.dispatch(setLoggedSuccess(true))
        callback(message.identi,message.result)
      }
    })
  }
  async modifyUser(modifyUserData: IMemberModi, callback:(modifySuccess:boolean)=>void) {
    console.log("modifyUser");
    const { id, member_id, member_identification, member_name, member_nick,department_name } = modifyUserData
    // let loginResult: boolean = false
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
    console.log(modifyUserData);
    //서버로 로그인 데이터 전송
    this.lobby.send(Message.REQ_USER_MODI, {
      id: modifyUserData.id,
      member_id: modifyUserData.member_id,
      member_identification: modifyUserData.member_identification,
      member_name: modifyUserData.member_name,
      member_nick: modifyUserData.member_nick,
      department_name: modifyUserData.department_name
  
    })
    this.lobby.onMessage(Message.RES_USER_MODI, (message) => {
      console.log(message)
      callback(message)
    })
    
  }
  async registerMember(registerData: IMember, callback:(registerSuccess:boolean)=>void) {
    console.log("in");
    const { id, password, identification, name, nickname,socialNum,department } = registerData
    // let loginResult: boolean = false
    this.registerLobby = await this.client.joinOrCreate(RoomType.REGISTERLOBBY)
    console.log(registerData);
    //서버로 로그인 데이터 전송
    this.registerLobby.send(Message.SEND_MEM_REGISTER_DATA, {
      id: registerData.id,
      password: registerData.password,
      identification: registerData.identification,
      name: registerData.name,
      nickname: registerData.nickname,
      socialNum: registerData.socialNum,
      department: registerData.department,
  
    })
    this.registerLobby.onMessage(Message.SEND_MEM_REGISTER_Result, (message) => {
      console.log(message.result)
      if (message.result === true) {
        callback(message.result)
      }
    })
    
  }
  async disPlayDepart(callback:(getUsersResult:any)=>void) {
    console.log('disPlayDepart')
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
     //서버로 로그인 데이터 전송
     this.lobby.send(Message.REQ_DEPART_LIST,{})
     this.lobby.onMessage(Message.RES_DEPART_LIST, (message) => {
       console.log(message)
       callback(message)
     })
   }
  async getUsers(callback:(getUsersResult:any)=>void) {
    console.log('getUsers')
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
     //서버로 로그인 데이터 전송
     this.lobby.send(Message.REQ_USER_lIST,{})
     this.lobby.onMessage(Message.RES_USER_lIST, (message) => {
       console.log(message)
       callback(message)
     })
   }
   
   async getOneMember(getOneMemberData: number,callback:(getOneMemberResult:any)=>void) {
    console.log('getOneMember')
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
     //서버로 로그인 데이터 전송
     this.lobby.send(Message.REQ_USER_ONE,{
      userid: getOneMemberData
     })
     this.lobby.onMessage(Message.RES_USER_ONE, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
   async deleteUser(deleteUserData: number,callback:(getUsersResult:any)=>void) {
    console.log('deleteUser')
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)
     //서버로 로그인 데이터 전송
     this.lobby.send(Message.REQ_USER_DELETE,{
      userid: deleteUserData
     })
     this.lobby.onMessage(Message.RES_USER_DELETE, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
  async getPosts(callback:(postResult:any)=>void) {
   console.log('getPostsclient')
   this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
    //서버로 로그인 데이터 전송
    this.postLobby.send(Message.SEND_POSTS_REQUEST,{})
    this.postLobby.onMessage(Message.SEND_POSTS_RESPONSE, (message) => {
      console.log(message)
      callback(message)
    })
    
  }
  async dump(callback:(dumpResult:any)=>void) {
    console.log('dump')
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.DUMP_IN,{})
     this.postLobby.onMessage(Message.DUMP_OUT, (message) => {
       callback(message)
     })
     
   }
  async getOneComment(commentId: number, callback:(getOneCommentResult:any)=>void) {
    console.log('getOneComment')
    console.log(commentId)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_COMMENT_ONE,{
      commentId: commentId
     })
     this.postLobby.onMessage(Message.RES_COMMENT_ONE, (message) => {
       console.log("RES_COMMENT_ONE")
       console.log(message)
       callback(message)
     })
     
   }
  async getOnePost(rpostId: number, callback:(getOnePostResult:any)=>void) {
    console.log('getOnePost')
    console.log("hghg")
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_POST_ONE,{
      postId: rpostId
     })
     this.postLobby.onMessage(Message.RES_POST_ONE, (message) => {
       console.log("RES_POST_ONE")
       callback(message)
     })
     
   }
  async registerPost(registerPostData: IPost,callback:(registerSuccess:boolean)=>void) {
   console.log('registerPost')
   console.log(registerPostData)
   this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
    //서버로 로그인 데이터 전송
    this.postLobby.send(Message.REQ_POSTS_REGISTER,{
      memberId: registerPostData.memberId,
      title: registerPostData.title,
      content: registerPostData.content,
      isNoti: registerPostData.isNoti,
    })
    this.postLobby.onMessage(Message.RES_POSTS_REGISTER, (message) => {
      console.log(message)
      callback(message)
    })
    
  }
  async registerComment(registerCommentData: IComment,callback:(registerSuccess:boolean)=>void) {
    console.log('registerComment')
    console.log(registerCommentData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_COMMENT_REGISTER,{
      user_id: registerCommentData.user_id,
       content: registerCommentData.content,
       post_id: registerCommentData.post_id,
     })
     this.postLobby.onMessage(Message.RES_COMMENT_REGISTER, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
   async displayComment(displayCommentData: number,callback:(registerSuccess:any)=>void) {
    console.log('displayComment')
    console.log(displayCommentData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_COMMENT_LIST,{
      post_id: displayCommentData
     })
     this.postLobby.onMessage(Message.RES_COMMENT_LIST, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
   async modifyComment(modifyCommentData: IComment,callback:(modifyCommentSuccess:boolean)=>void) {
    console.log('modifyComment')
    console.log(modifyCommentData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_COMMENT_MODIFY,{
       id: modifyCommentData.id,
       content: modifyCommentData.content
     })
     this.postLobby.onMessage(Message.RES_COMMENT_MODIFY, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
  async modifyPost(modifyPostData: IPost,callback:(registerSuccess:boolean)=>void) {
    console.log('modifyPost')
    console.log(modifyPostData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_POSTS_MODIFY,{
       title: modifyPostData.title,
       content: modifyPostData.content,
       id: modifyPostData.isNoti,
     })
     this.postLobby.onMessage(Message.RES_POSTS_MODIFY, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
  async deletePost(deleteData: number,callback:(deleteSuccess:boolean)=>void) {
    console.log('deletePost')
    console.log(deleteData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_POSTS_DELETE,{
       postId: deleteData
     })
     this.postLobby.onMessage(Message.RES_POSTS_DELETE, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
   async deleteComment(deleteCommentData: number,callback:(deleteSuccess:boolean)=>void) {
    console.log('deletePost')
    console.log(deleteCommentData)
    this.postLobby = await this.client.joinOrCreate(RoomType.POSTLOBBY)
     //서버로 로그인 데이터 전송
     this.postLobby.send(Message.REQ_COMMENT_DELETE,{
       commentId: deleteCommentData
     })
     this.postLobby.onMessage(Message.RES_COMMENT_DELETE, (message) => {
       console.log(message)
       callback(message)
     })
     
   }
   async getLectureVideoList(userData: ILectureVideo,callback:(lectureVideoList:any)=>void) {
    
    console.log('getLectureVideoList')
    
    console.log(userData)
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    
    this.lectureVideoLobby.send(Message.SEND_LECTURE_VIDEO_LIST_REQUEST,{
      id: userData.memberId,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_LECTURE_VIDEO_LIST_RESPONSE, (message) => {
      callback(message)
    })
  }
  async isPro(userData: ILectureVideo,callback:(lectureVideoList:any)=>void) {
    console.log('isPro')
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    this.lectureVideoLobby.send(Message.SEND_ISPRO_REQUEST,{
      id: userData.memberId,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_ISPRO_RESPONSE, (message)=>{
      callback(message)
    })
  }
  async uploadLectureVideo(lectureVideo: ILectureVideo, callback:(lectureVideoList:any)=>void){
    console.log('uploadVideo')
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    this.lectureVideoLobby.send(Message.SEND_REGI_LECTURE_VIDEO_REQUEST,{
      lecture_id: lectureVideo.lectureId,
      lecture_video: lectureVideo.video,
      lecture_video_contents: lectureVideo.content,
      lecture_video_title: lectureVideo.title,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_REGI_LECTURE_VIDEO_RESPONSE, (message)=>{
      callback(message);
    })
  }
  async getLectureList(userData: ILectureVideo,callback:(lectureVideoList:any)=>void) {
    console.log('getLectureList')
    console.log(userData)
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    
    this.lectureVideoLobby.send(Message.SEND_LECTURE_LIST_REQUEST,{
      id: userData.memberId,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_LECTURE_LIST_RESPONSE, (message) => {
      callback(message)
    })
  }
  async deleteLectureVideo(lectureVideo: ILectureVideo,callback:(result:boolean)=>void) {
    console.log('deleteLectureVideo')
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    console.log(lectureVideo)
    this.lectureVideoLobby.send(Message.SEND_DELETE_VIDEO_REQUEST,{
      lecture_id: lectureVideo,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_DELETE_VIDEO_RESPONSE, (message)=>{
      callback(message)
    })
  }
  async updateLectureVideo(lectureVideo: ILectureVideo, callback:(lectureVideoList:any)=>void){
    console.log('updateVideo')
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    console.log(lectureVideo)
    this.lectureVideoLobby.send(Message.SEND_UPDATE_VIDEO_REQUEST,{
      id: lectureVideo.lectureId,
      lecture_video: lectureVideo.video,
      lecture_video_contents: lectureVideo.content,
      lecture_video_title: lectureVideo.title,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_UPDATE_VIDEO_RESPONSE, (message)=>{
      callback(message);
    })
  }
  async getOneLectureVideo(lectureVideo: ILectureVideo, callback:(lectureVideoList:any)=>void){
    console.log('getOneLectureVideo')
    this.lectureVideoLobby = await this.client.joinOrCreate(RoomType.LECTUREVIDEOLOBBY)
    this.lectureVideoLobby.send(Message.SEND_ONE_LECTURE_VIDEO_REQUEST, {
      id: lectureVideo.lectureId,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_ONE_LECTURE_VIDEO_RESPONSE, (message)=>{
      callback(message);
    })
  }
  async getLectureTitle(lectureVideo: ILectureVideo, callback:(lecture: any)=> void){
    console.log('getLectureTitle')
    this.lectureVideoLobby.send(Message.SEND_LECTURE_TITLE_REQUEST, {
      lectureId: lectureVideo,
    })
    this.lectureVideoLobby.onMessage(Message.SEND_LECTURE_TITLE_RESPONSE, (message)=>{
      callback(message);
    })
  }
  // square initialize
  squareInit() {
    
    if (!this.room) return
    if (!this.square) return

    this.room?.leave()
    
    
    // new instance added to the players MapSchema
    this.square.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return
      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {
            phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            console.log('square init')
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.square.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
    }

    // new instance added to the computers MapSchema
    this.square.state.computers.onAdd = (computer: IComputer, key: string) => {
      // track changes on every child object's connectedUser
      computer.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.COMPUTER)
      }
      computer.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.COMPUTER)
      }
    }

    // new instance added to the whiteboards MapSchema
    this.square.state.whiteboards.onAdd = (whiteboard: IWhiteboard, key: string) => {
      store.dispatch(
        setWhiteboardUrls({
          whiteboardId: key,
          roomId: whiteboard.roomId,
        })
      )
      // track changes on every child object's connectedUser
      whiteboard.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.WHITEBOARD)
      }
      whiteboard.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.WHITEBOARD)
      }
    }

    // new instance added to the chatMessages ArraySchema
    this.square.state.chatMessages.onAdd = (item, index) => {
      store.dispatch(pushChatMessage(item))
    }

    // when the server sends room data
    this.square.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    // when a user sends a message
    this.square.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
      phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    })

    // when a peer disconnects with myPeer
    this.square.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })

    // when a computer user stops sharing screen
    this.square.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const computerState = store.getState().computer
      computerState.shareScreenManager?.onUserLeft(clientId)
    })

  
    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  // set up all network listeners before the game starts
  initialize() {
    if (!this.room) return

    this.lobby?.leave()
    this.square?.leave()

    // this.mySessionId = this.room.sessionId
    // store.dispatch(setSessionId(this.room.sessionId))
    // this.webRTC = new WebRTC(this.mySessionId, this)
   
    // new instance added to the players MapSchema
    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return

      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {
            phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
    }

    // new instance added to the computers MapSchema
    this.room.state.computers.onAdd = (computer: IComputer, key: string) => {
      // track changes on every child object's connectedUser
      computer.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.COMPUTER)
      }
      computer.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.COMPUTER)
      }
    }

    // new instance added to the whiteboards MapSchema
    this.room.state.whiteboards.onAdd = (whiteboard: IWhiteboard, key: string) => {
      store.dispatch(
        setWhiteboardUrls({
          whiteboardId: key,
          roomId: whiteboard.roomId,
        })
      )
      // track changes on every child object's connectedUser
      whiteboard.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.WHITEBOARD)
      }
      whiteboard.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.WHITEBOARD)
      }
    }

    // new instance added to the chatMessages ArraySchema
    this.room.state.chatMessages.onAdd = (item, index) => {
      store.dispatch(pushChatMessage(item))
    }

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    // when a user sends a message
    this.room.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
      phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    })

    // when a peer disconnects with myPeer
    this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })

    // when a computer user stops sharing screen
    this.room.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const computerState = store.getState().computer
      computerState.shareScreenManager?.onUserLeft(clientId)
    })
    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  // method to register event listener and call back function when a item user added
  onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
    console.log('chat')
    phaserEvents.on(Event.UPDATE_DIALOG_BUBBLE, callback, context)
  }

  // method to register event listener and call back function when a item user added
  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_ADDED, callback, context)
  }

  // method to register event listener and call back function when a item user removed
  onItemUserRemoved(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_REMOVED, callback, context)
  }

  // method to register event listener and call back function when a player joined
  onPlayerJoined(callback: (Player: IPlayer, key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_JOINED, callback, context)
  }

  // method to register event listener and call back function when a player left
  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_LEFT, callback, context)
  }

  // method to register event listener and call back function when myPlayer is ready to connect
  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_READY, callback, context)
  }

  // method to register event listener and call back function when my video is connected
  onMyPlayerVideoConnected(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  }

  // method to register event listener and call back function when a player updated
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.PLAYER_UPDATED, callback, context)
  }

  // method to send player updates to Colyseus server
  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    if (this.scene === 'game')
      this.room?.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
    else if (this.scene === 'square')
      this.square?.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
  }

  // method to send player name to Colyseus server
  updatePlayerName(currentName: string) {
    if (this.scene === 'game')
      this.room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
    else if (this.scene === 'square')
      this.square?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
  }

  // method to send ready-to-connect signal to Colyseus server
  readyToConnect() {
    if (this.scene === 'game')
      this.room?.send(Message.READY_TO_CONNECT)
    else if (this.scene === 'square')
      this.square?.send(Message.READY_TO_CONNECT)
    phaserEvents.emit(Event.MY_PLAYER_READY)
  }

  // method to send ready-to-connect signal to Colyseus server
  videoConnected() {
    if (this.scene === 'game')
      this.room?.send(Message.VIDEO_CONNECTED)
    else if (this.scene === 'square')
      this.square?.send(Message.VIDEO_CONNECTED)
    phaserEvents.emit(Event.MY_PLAYER_VIDEO_CONNECTED)
  }

  // method to send stream-disconnection signal to Colyseus server
  playerStreamDisconnect(id: string) {
    if (this.scene === 'game')
      this.room?.send(Message.DISCONNECT_STREAM, { clientId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.DISCONNECT_STREAM, { clientId: id })
    this.webRTC?.deleteVideoStream(id)
  }

  connectToComputer(id: string) {
    if (this.scene === 'game')
      this.room?.send(Message.CONNECT_TO_COMPUTER, { computerId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.CONNECT_TO_COMPUTER, { computerId: id })
  }

  disconnectFromComputer(id: string) {
    if (this.scene === 'game')
      this.room?.send(Message.DISCONNECT_FROM_COMPUTER, { computerId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.DISCONNECT_FROM_COMPUTER, { computerId: id })
  }

  connectToWhiteboard(id: string) {
    console.log(this.scene)
    if (this.scene === 'game')
      this.room?.send(Message.CONNECT_TO_WHITEBOARD, { whiteboardId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.CONNECT_TO_WHITEBOARD, { whiteboardId: id })
  }

  disconnectFromWhiteboard(id: string) {
    if (this.scene === 'game')
      this.room?.send(Message.DISCONNECT_FROM_WHITEBOARD, { whiteboardId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.DISCONNECT_FROM_WHITEBOARD, { whiteboardId: id })
  }

  onStopScreenShare(id: string) {
    if (this.scene === 'game')
      this.room?.send(Message.STOP_SCREEN_SHARE, { computerId: id })
    else if (this.scene === 'square')
      this.square?.send(Message.STOP_SCREEN_SHARE, { computerId: id })

  }

  addChatMessage(content: string) {
    if (this.scene === 'game')
      this.room?.send(Message.ADD_CHAT_MESSAGE, { content: content })
    else if (this.scene === 'square')
      this.square?.send(Message.ADD_CHAT_MESSAGE, { content: content })
  }
}
