import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

export const logInfoSlice = createSlice({
  name: 'logInfo',
  initialState: {
    userId: '',
    userName: '',
    userAvatar: '',
    userLocation: 'office',
   
  },
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.userAvatar = action.payload
    },
    setUserLocation: (state, action: PayloadAction<string>) => {
      state.userLocation = action.payload
    },
    // setLoggedIn: (state, action: PayloadAction<boolean>) => {
    //   state.loggedIn = action.payload
    // },
    // setLoggedSuccess: (state, action: PayloadAction<boolean>) => {
    //   state.loggedSuccess = action.payload
    // },
    // setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
    //   state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    // },
    // removePlayerNameMap: (state, action: PayloadAction<string>) => {
    //   state.playerNameMap.delete(sanitizeId(action.payload))
    // },
  },
})

export const {
  setUserId,
  setUserName,
  setUserAvatar,
  setUserLocation,
  
} = logInfoSlice.actions

export default logInfoSlice.reducer
