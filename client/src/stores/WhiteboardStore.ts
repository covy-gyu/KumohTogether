import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface WhiteboardState {
  comentModOpen: boolean
  cashComment:number
  cashPost:number
  modifyPostOpen: boolean
  onePostOpen: boolean
  newPostOpen: boolean
  whiteboardDialogOpen: boolean
  whiteboardId: null | string
  whiteboardUrl: null | string
  urls: Map<string, string>
}

const initialState: WhiteboardState = {
  comentModOpen:false,
  cashComment:-1,
  cashPost:-1,
  modifyPostOpen:false,
  onePostOpen:false,
  newPostOpen: false,
  whiteboardDialogOpen: false,
  whiteboardId: null,
  whiteboardUrl: null,
  urls: new Map(),
}

export const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    openWhiteboardDialog: (state, action: PayloadAction<string>) => {
      state.whiteboardDialogOpen = true
      state.whiteboardId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.whiteboardUrl = url
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeWhiteboardDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromWhiteboard(state.whiteboardId!)
      state.whiteboardDialogOpen = false
      state.whiteboardId = null
      state.whiteboardUrl = null
    },
    openNewPostOpen: (state) => {
      state.newPostOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeNewPostOpen: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.newPostOpen = false
    },
    openComentModOpen: (state) => {
      state.comentModOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeComentModOpen: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.comentModOpen = false
    },
    openOnePostOpen: (state) => {
      console.log("openOnePostOpen")
      state.onePostOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeOnePostOpen: (state) => {
      console.log("closeOnePostOpen")
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.onePostOpen = false
    },
    openmodifyPostOpen: (state) => {
      state.modifyPostOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closemodifyPostOpen: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.modifyPostOpen = false
    },
    setCashPost: (state, action: PayloadAction<number>) => {
      state.cashPost = action.payload
    },
    setCashComment: (state, action: PayloadAction<number>) => {
      state.cashComment = action.payload
    },
    setWhiteboardUrls: (state, action: PayloadAction<{ whiteboardId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.whiteboardId,
        `https://www.tldraw.com/r/sky-office-${action.payload.roomId}`
      )
    },
  },
})

export const { openWhiteboardDialog, closeWhiteboardDialog, setWhiteboardUrls,openNewPostOpen,closeNewPostOpen,openOnePostOpen,closeOnePostOpen,setCashPost,openmodifyPostOpen,closemodifyPostOpen,setCashComment,openComentModOpen,closeComentModOpen} =
  whiteboardSlice.actions

export default whiteboardSlice.reducer
