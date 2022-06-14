import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId:-1,
    suser:'',
    backgroundMode: getInitialBackgroundMode(),
    sessionId: '',
    videoConnected: false,
    loggedIn: false,
    loggedSuccess: false,
    registerMode: false,
    adminMode: false,
    adminModiMode: false,
    playerNameMap: new Map<string, string>(),
    loginInfoMap: new Map<string, string>(),
  },
  reducers: {
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY

      state.backgroundMode = newMode
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.changeBackgroundMode(newMode)
    },
    setSuser: (state, action: PayloadAction<string>) => {
      state.suser = action.payload
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setVideoConnected: (state, action: PayloadAction<boolean>) => {
      state.videoConnected = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setRegistermode: (state, action: PayloadAction<boolean>) => {
      state.registerMode = action.payload
    },
    setLoggedSuccess: (state, action: PayloadAction<boolean>) => {
      state.loggedSuccess = action.payload
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload
    },
    setAdminMode: (state, action: PayloadAction<boolean>) => {
      state.adminMode = action.payload
    },
    setAdminModiMode: (state, action: PayloadAction<boolean>) => {
      state.adminModiMode = action.payload
    },
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },
  },
})

export const {
  toggleBackgroundMode,
  setSessionId,
  setVideoConnected,
  setLoggedIn,
  setPlayerNameMap,
  removePlayerNameMap,
  setLoggedSuccess,
  setRegistermode,
  setSuser,
  setAdminMode,
  setUserId,
  setAdminModiMode,
} = userSlice.actions

export default userSlice.reducer
