import React, { useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Button from '@mui/material/Button'
import phaserGame from '../PhaserGame'
import { ILectureVideo } from '../../../types/LectureVideo'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeWhiteboardDialog, openLectureVideo, openUploadLectureVideo, openUpdateLectureVideo } from '../stores/PersonalStore'
import Bootstrap from '../scenes/Bootstrap'

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
const WhiteboardWrapper = styled.div`
  flex: 1;
  border-radius: 25px;
  overflow: hidden;
  margin-right: 50px;
  iframe {
    width: 100%;
    height: 100%;
  }
`
const TableRowWrapper = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  }

  .avatar {
    height: 30px;
    width: 30px;
    font-size: 15px;
  }

  .name {
    min-width: 100px;
    overflow-wrap: anywhere;
  }

  .description {
    min-width: 200px;
    overflow-wrap: anywhere;
  }

  .join-wrapper {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .lock-icon {
    font-size: 18px;
  }
`
const ButtonWrapper = styled.div`
  
  overflow: hidden;
  iframe {
    width: 30%;
    height: 100%;
  }
`

export default function PersonalDialog() {
  const userIda = useAppSelector((state) => state.user.suser)
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [lectureVideoList, setLectureVideoList] = useState<any[]>([])

  const [isProf, setIsProf] = useState();

  const [userInfo, setUserId] = useState<ILectureVideo>({
    memberId: userIda,
    title: '',
    content: '',
    video: '',
    lectureId: '',
    lectureTitle: '',
  })

  useEffect(() => {
    bootstrap.network.getLectureVideoList(userInfo, (lectureVideos) => {
      if (lectureVideos) {
        setLectureVideoList(lectureVideos);
      }
    })
    bootstrap.network.isPro(userInfo, (message) => {
      setIsProf(message);
    })
  }, [])

  const clickSeeVideo = (params, e) => {
    e.preventDefault();
    dispatch(openLectureVideo(params));
    dispatch(closeWhiteboardDialog());
  }

  const updateVideo = (params, e) => {
    e.preventDefault();
    dispatch(openUpdateLectureVideo(params));
    dispatch(closeWhiteboardDialog());
  }

  const deleteVideo = (params, e) => {
    e.preventDefault();
    console.log(params)
    bootstrap.network.deleteLectureVideo(params, (result) => {
      if (result)
        dispatch(closeWhiteboardDialog());
    });
  }

  const uploadVideo = (e) => {
    e.preventDefault();
    dispatch(openUploadLectureVideo());
    dispatch(closeWhiteboardDialog());
  }

  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closeWhiteboardDialog())}
        >
          <CloseIcon />
        </IconButton>
        <WhiteboardWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>강의</TableCell>
                <TableCell>강의 제목</TableCell>
                <TableCell>강의 내용</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectureVideoList.map((lectureVideos) => {
                return (
                  <>
                    {lectureVideos.map((lectureVideo) => {
                      const { id, lecture_video, lecture_video_contents, lecture_video_title, lecture_id } = lectureVideo;
                      return (
                        <TableRowWrapper key={id}>
                          <TableCell>
                            <div>{lecture_id}</div>
                          </TableCell>
                          <TableCell>
                            {lecture_video_title}
                          </TableCell>
                          <TableCell>{lecture_video_contents}</TableCell>
                          <TableCell><Button onClick={(e) => { clickSeeVideo({ lecture_video, lecture_video_title }, e) }}>강의보기</Button></TableCell>
                          <TableCell>{isProf && <Button variant="text" onClick={(e) => { updateVideo({ id, lecture_video_title, lecture_video_contents }, e) }}>수정</Button>}</TableCell>
                          <TableCell>{isProf && <Button variant="text" onClick={(e) => { deleteVideo(id, e) }}>삭제</Button>}</TableCell>
                        </TableRowWrapper>
                      )
                    })}
                  </>
                )
              })}
            </TableBody>
          </Table>
          {isProf && <Button variant="text" onClick={(e) => { uploadVideo(e) }}>강의추가</Button>}
        </WhiteboardWrapper>
      </Wrapper>
    </Backdrop>
  )
}