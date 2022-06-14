import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useAppSelector, useAppDispatch } from '../hooks'

import { colseLectureVideo } from '../stores/PersonalStore'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 16px 180px 16px 16px;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
`

export default function LectureVideo() {
  const dispatch = useAppDispatch()
  const url = useAppSelector((state) => state.personal.lectureVideoUrl)
  const title = useAppSelector((state) => state.personal.lectureVideoTitle)
  const style = {
    color: 'white'
  }
  const config: string = '/videos/'

  const realUrl = config + url;

  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(colseLectureVideo())}
        >
          <CloseIcon/>
        </IconButton>
        <h1 style={style}> {title} </h1>
        <video src={realUrl} width={"80%"} height={'80%'} autoPlay></video>
      </Wrapper>
    </Backdrop>
  )
}