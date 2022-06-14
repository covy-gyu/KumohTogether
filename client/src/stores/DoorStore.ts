import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import ClassRoom from '../scenes/ClassRoom'
import Conference from '../scenes/Conference'
import Game from '../scenes/Game'
import Square from '../scenes/Square'

interface DoorState {
  doorOpen: boolean
  doorType: null | string
  doorLocation: string
}

const initialState: DoorState = {
  doorOpen: false,
  doorType: null,
  doorLocation: '',
}

export const doorSlice = createSlice({
  
  name: 'door',
  initialState,
  reducers: {
    openSquare: (state) => {
      state.doorOpen = true
      const square = phaserGame.scene.keys.square as Square
      
      square.registerKeys()
      
    },
    openDigital: (state) => {
      state.doorOpen = true
      const game = phaserGame.scene.keys.game as Game
      
      game.registerKeys()
      
    },
    openClass: (state) => {
      state.doorOpen = true
      const classRoom = phaserGame.scene.keys.classRoom as ClassRoom
      
      classRoom.registerKeys()
      
    },
    openConfer: (state) => {
      state.doorOpen = true
      const conference = phaserGame.scene.keys.conference as Conference
      
      conference.registerKeys()
      
    },
    closeDoor: (state) => {
      state.doorOpen = false
    },
    setDoorLocation: (state, action: PayloadAction<string>) => {
      state.doorLocation = action.payload
    },
    // closeWhiteboardDialog: (state) => {
    //   const game = phaserGame.scene.keys.game as Game
    //   game.enableKeys()
    //   game.network.disconnectFromWhiteboard(state.whiteboardId!)
    //   state.whiteboardDialogOpen = false
    //   state.whiteboardId = null
    //   state.whiteboardUrl = null
    // },
    // setWhiteboardUrls: (state, action: PayloadAction<{ whiteboardId: string; roomId: string }>) => {
    //   state.urls.set(
    //     action.payload.whiteboardId,
    //     `https://www.tldraw.com/r/sky-office-${action.payload.roomId}`
    //   )
    // },
  },
})

export const { 
  openSquare,
  openDigital,
  setDoorLocation,
  closeDoor,
  openClass,
  openConfer,
 } =
  doorSlice.actions

export default doorSlice.reducer
