import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface PersonalState {
    whiteboardDialogOpen: boolean
    whiteboardId: null | string
    whiteboardUrl: null | string
    urls: Map<string, string>
    lectureVideoOpen: boolean
    lectureVideoUrl: string
    lectureVideoTitle: string
    lectureVideoContent: string
    lectureVideoId: string
    uploadLectureVideo: boolean
    updateLectureVideo: boolean
}
const initialState: PersonalState = {
    whiteboardDialogOpen: false,
    whiteboardId: null,
    whiteboardUrl: null,
    urls: new Map(),
    lectureVideoOpen: false,
    lectureVideoUrl: '',
    lectureVideoTitle: '',
    lectureVideoContent: '',
    lectureVideoId: '',
    uploadLectureVideo: false,
    updateLectureVideo: false,
}

export const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        openLectureVideo: (state, action: PayloadAction<Object>) => {
            state.lectureVideoOpen = true
            console.log(Object.values(action.payload))
            state.lectureVideoUrl = Object.values(action.payload)[0]
            state.lectureVideoTitle = Object.values(action.payload)[1]
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        colseLectureVideo: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            state.lectureVideoOpen = false
        },
        openUploadLectureVideo: (state) => {
            state.uploadLectureVideo = true
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        colseUploadLectureVideo: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            state.uploadLectureVideo = false
        },
        openUpdateLectureVideo: (state, action: PayloadAction<Object>) => {
            state.updateLectureVideo = true
            state.lectureVideoId = Object.values(action.payload)[0]
            state.lectureVideoTitle = Object.values(action.payload)[1]
            state.lectureVideoContent = Object.values(action.payload)[2]
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        colseUpdateLectureVideo: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            state.updateLectureVideo = false
        },
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
        setWhiteboardUrls: (state, action: PayloadAction<{ whiteboardId: string; roomId: string }>) => {
            state.urls.set(
                action.payload.whiteboardId,
                `https://www.tldraw.com/r/sky-office-${action.payload.roomId}`
            )
        },
    },
})

export const { openWhiteboardDialog, closeWhiteboardDialog, setWhiteboardUrls, openLectureVideo, colseLectureVideo, colseUploadLectureVideo, openUploadLectureVideo, colseUpdateLectureVideo, openUpdateLectureVideo } =
    personalSlice.actions

export default personalSlice.reducer