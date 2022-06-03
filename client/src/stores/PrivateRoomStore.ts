import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoomAvailable } from 'colyseus.js'
import { RoomType } from '../../../types/Rooms'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface RoomInterface extends RoomAvailable {
  name?: string
}

/**
 * Colyseus' real time room list always includes the public lobby so we have to remove it manually.
 */
const isCustomRoom = (room: RoomInterface) => {
  return room.name === RoomType.CUSTOM
}

export const roomSlice = createSlice({
  name: 'privateRoom',
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    roomtype: '',
    roomId: '',
    roomName: '',
    roomDescription: '',
    availableRooms: new Array<RoomAvailable>(),
    roomTableDialogOpen: false,


  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    setRoomType: (
      state,
      action: PayloadAction<{ roomtype: string }>
    ) => {
      state.roomtype = action.payload.roomtype
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      state.roomId = action.payload.id
      state.roomName = action.payload.name
      state.roomDescription = action.payload.description
    },
    setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload.filter((room) => isCustomRoom(room))
    },
    addAvailableRooms: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
      if (!isCustomRoom(action.payload.room)) return
      const roomIndex = state.availableRooms.findIndex(
        (room) => room.roomId === action.payload.roomId
      )
      if (roomIndex !== -1) {
        state.availableRooms[roomIndex] = action.payload.room
      } else {
        state.availableRooms.push(action.payload.room)
      }
    },
    removeAvailableRooms: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter((room) => room.roomId !== action.payload)
    },
    openRoomTableDialog: (state) => {
      state.roomTableDialogOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeRoomTableDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.roomTableDialogOpen = false
    },
    // setRoomTableUrls: (state, action: PayloadAction<{ whiteboardId: string; roomId: string }>) => {
    //   state.urls.set(
    //     action.payload.whiteboardId,
    //     `https://www.tldraw.com/r/sky-office-${action.payload.roomId}`
    //   )
    // },
  },
})

export const {
  setLobbyJoined,
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
  setRoomType,
  openRoomTableDialog,
  closeRoomTableDialog,
} = roomSlice.actions

export default roomSlice.reducer
