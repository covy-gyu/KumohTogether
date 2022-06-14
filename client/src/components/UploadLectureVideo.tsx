import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import SelectBox from '@mui/material/Select'
import { useAppSelector, useAppDispatch } from '../hooks'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { ILectureVideo } from '../../../types/LectureVideo'
import { colseUploadLectureVideo } from '../stores/PersonalStore'
import Game from '../scenes/Game';

const BASE_URL: string = "http://localhost:3000";

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
const WhiteboardWrapper = styled.form`
  flex: 1;
  border-radius: 25px;
  overflow: hidden;
  margin-right: 50px;
  iframe {
    width: 100%;
    height: 100%;
  }
`
const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`
export default function UploadLectureVideo() {
  // const [content, setContent] = useState("");
  // const [uploadedImg, setUploadedImg] = useState({
  //   fileName:'',
  //   filePath:'',
  // });

  // const onChange = e => {
  //   setContent(e.target.files[0]);
  // };


  const userIda = useAppSelector((state) => state.user.suser)
  const dispatch = useAppDispatch()
  const [lectureList, setLectureList] = useState<any[]>([])
  const [ttFieldEmpty, setTtFieldEmpty] = useState<boolean>(false)
  const [ctFieldEmpty, setCtFieldEmpty] = useState<boolean>(false)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const game = phaserGame.scene.keys.game as Game

  useEffect(() => {
    game.network.getLectureList(userInfo, (lectureList) => {
      if (lectureList) {
        setLectureList(lectureList);
        console.log(lectureList)
      }
    })
  }, [])

  const [userInfo, setUserId] = useState<ILectureVideo>({
    memberId: userIda,
    title: '',
    content: '',
    video: '',
    lectureId: '',
    lectureTitle: '',
  })

  const handleChange = (prop: keyof ILectureVideo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId({ ...userInfo, [prop]: event.target.value })
    // if(event.target.id=="file"){
    //   onChange(event);
    // }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidTitle = userInfo.title !== ''
    const isValidContent = userInfo.content !== ''

    if (isValidTitle === ttFieldEmpty) setTtFieldEmpty(!ttFieldEmpty)
    if (isValidContent === ctFieldEmpty) setCtFieldEmpty(!ctFieldEmpty)

    if (isValidTitle && isValidContent) {
      setUserId({ ...userInfo, video: userInfo.video.split('\\').reverse()[0] })
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.network.uploadLectureVideo(userInfo, (message) => {
        if (message) {
          dispatch(colseUploadLectureVideo());

          //const formData = new FormData();
          //formData.append("img", content);
          //axios
          //  .post("/upload", formData)
          //  .then(res => {
          //    const fileName:string  = res.data;
          //    console.log(fileName);
          //    const filePath: string = `${BASE_URL}/img/${fileName}`
          //    setUploadedImg({fileName,filePath: filePath});
          //    alert("The file is successfully uploaded");
          //  })
          //  .catch(err => {
          //    console.error(err);
          //  });
        }
      })
    }
  }

  const handleSelect = (e) => {
    setUserId({
      ...userInfo, lectureId: e.target.value
    })
  }

  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(colseUploadLectureVideo())}
        >
          <CloseIcon />
        </IconButton>
        <Title> 강의 영상 업로드 </Title>
        <SelectBox defaultValue={"default"} onChange={(e) => handleSelect(e)}>
          <option value="default" disabled style={{ color: "#ccc" }}>
            ---강의선택---
          </option>
          {lectureList.map((lectures) => {
            const { id, lecture_name } = lectures;
            return (
              <option value={id}>{lecture_name}</option>
            )
          })}
        </SelectBox>
        <WhiteboardWrapper onSubmit={handleRegister}>
          <Content onSubmit={handleRegister}>
            <TextField
              autoFocus
              fullWidth
              label="강의 제목"
              variant="outlined"
              color="secondary"
              error={ttFieldEmpty}
              helperText={ttFieldEmpty && '강의 제목이 필요합니다.'}
              onChange={handleChange('title')}
            />
            <TextField
              fullWidth
              label="강의 내용"
              variant="outlined"
              color="secondary"
              multiline
              rows={4}
              error={ctFieldEmpty}
              helperText={ctFieldEmpty && '강의 내용이 필요합니다.'}
              onChange={handleChange('content')}
            />
            <Input id='file' type='file' onChange={handleChange('video')}></Input>
            <Button variant="contained" color="secondary" type="submit">
              강의 영상 등록
            </Button>
          </Content>
        </WhiteboardWrapper>

      </Wrapper>
    </Backdrop>
  )
}