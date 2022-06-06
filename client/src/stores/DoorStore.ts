import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import Square from '../scenes/Square'

interface DoorState {
  doorOpen: boolean
  doorType: null | string
  doorUrl: null | string
}

const initialState: DoorState = {
  doorOpen: false,
  doorType: null,
  doorUrl: null,
}

export const doorSlice = createSlice({
  
  name: 'door',
  initialState,
  reducers: {
    openDoor: (state) => {
      state.doorOpen = true
      const square = phaserGame.scene.keys.square as Square
      const game = phaserGame.scene.keys.game as Game
      square.registerKeys()
      
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

export const { openDoor } =
  doorSlice.actions

export default doorSlice.reducer
