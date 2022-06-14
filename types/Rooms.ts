export enum RoomType {
  LOGIN = 'login',
  LOBBY = 'lobby',
  PUBLIC = 'public',
  CUSTOM = 'custom',
  SQUARE = 'square',
  REGISTERLOBBY = 'registerlobby',
  LECTUREVIDEOLOBBY = 'lectureVideoLobby',
  POSTLOBBY = 'postlobby',
}

export interface IRoomData {
  name: string
  description: string
  password: string | null
  autoDispose: boolean
}
