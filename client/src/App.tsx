import React from 'react'
import styled from 'styled-components'

import { useAppSelector } from './hooks'

import LoginLobbyDialog from './components/LoginLobbyDialog'
import LoginDialog from './components/LoginDialog'
import ComputerDialog from './components/ComputerDialog'
import WhiteboardDialog from './components/WhiteboardDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import Chat from './components/Chat'
import HelperButtonGroup from './components/HelperButtonGroup'
import MemberRegister from './components/MemberRegister'
import NewPost from './components/NewPost'
import OnePostDialog from './components/OnePostDialog'
import Modifycase from './components/Modifycase'
import CommentModify from './components/CommentModify'
import MemberListDialog from './components/MemberListDialog'
import MemberModifyDialog from './components/MemberModifyDialog'
import RoomTableDialog from './components/RoomTableDialog'
import SquareDialog from './components/SquareDialog'
import LectureVideo from './components/LectureVideo'
import UploadLectureVideo from './components/UploadLectureVideo'
import UpdateLectureVideo from './components/UpdateLectureVideo'
import PersonalDIalog from './components/PersonalDIalog'
const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const onePostOpen = useAppSelector((state) => state.whiteboard.onePostOpen)
  const modifyPostOpen = useAppSelector((state) => state.whiteboard.modifyPostOpen)
  const newPostOpen = useAppSelector((state) => state.whiteboard.newPostOpen)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const Registermode = useAppSelector((state) => state.user.registerMode)
  const AdminMode = useAppSelector((state) => state.user.adminMode)
  const AdminModiMode = useAppSelector((state) => state.user.adminModiMode)
  const comentModOpen = useAppSelector((state) => state.whiteboard.comentModOpen)
  const openRoomTableDialog = useAppSelector((state) => state.privateRoom.roomTableDialogOpen)
  const openDoor = useAppSelector((state) => state.door.doorOpen)
  const lectureVideo = useAppSelector((state) => state.personal.lectureVideoOpen)
  const uploadLectureVideo = useAppSelector((state) => state.personal.uploadLectureVideo)
  const updateLectureVideo = useAppSelector((state) => state.personal.updateLectureVideo)
  const openPersonal = useAppSelector((state) => state.personal.whiteboardDialogOpen)

  let ui: JSX.Element
  if (loggedIn) {
    if (computerDialogOpen) {
      /* Render ComputerDialog if user is using a computer. */
      ui = <ComputerDialog />
    }else if(lectureVideo){
      ui = <LectureVideo />
    } else if(uploadLectureVideo){
      ui = <UploadLectureVideo />
    } else if(updateLectureVideo){
      ui = <UpdateLectureVideo />
    }else if (onePostOpen) {
      ui = <OnePostDialog />
    }else if (newPostOpen) {
      ui = <NewPost />
    }else if (modifyPostOpen) {
      ui = <Modifycase />
    } else if (comentModOpen) {
      ui = <CommentModify />
    } else if (openRoomTableDialog) {
      ui = <RoomTableDialog />
    }else if (openPersonal) {
      ui = <PersonalDIalog />
    }
     else if (whiteboardDialogOpen) {
      ui = <WhiteboardDialog />
    } else {
      ui = (
        <>
          <Chat />
          {/* Render VideoConnectionDialog if user is not connected to a webcam. */}
          {!videoConnected && <VideoConnectionDialog />}
          {openDoor ? <SquareDialog />:null}

        </>
      )
    }
  } else if (roomJoined) {
    /* Render LoginDialog if not logged in but selected a room. */
    ui = <LoginDialog />
  }else if (AdminModiMode) {
    /* Render LoginDialog if not logged in but selected a room. */
    ui = <MemberModifyDialog />
  }else if (AdminMode) {
    /* Render LoginDialog if not logged in but selected a room. */
    ui = <MemberListDialog />
  } else if (Registermode) {
    console.log('Register');
    /* Render LoginDialog if not logged in but selected a room. */
    ui = <MemberRegister />
  } else {
    /* Render LoginLobbyDialog if yet selected a room. */
    ui = <LoginLobbyDialog />
  }

  return (
    <Backdrop>
      {ui}
      {/* Render HelperButtonGroup if no dialogs are opened. */}
      {!computerDialogOpen && !whiteboardDialogOpen && <HelperButtonGroup />}
    </Backdrop>
  )
}

export default App
