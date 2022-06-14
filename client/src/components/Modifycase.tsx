import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Bootstrap from '../scenes/Bootstrap'
import phaserGame from '../PhaserGame'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closemodifyPostOpen } from '../stores/WhiteboardStore'

import { IPost } from '../../../types/Post'
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
const ButtonWrapper = styled.div`
  overflow: hidden;
  iframe {
    width: 30%;
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
export default function Modifycase() {
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const cPost = useAppSelector((state) => state.whiteboard.cashPost)

  let noti = false
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [Postas, setPostas] = useState([])
  const [ttFieldEmpty, setTtFieldEmpty] = useState<boolean>(false)
  const [ctFieldEmpty, setCtFieldEmpty] = useState<boolean>(false)
  const [values, setValues] = useState<IPost>({
  
    memberId: '',
    title: '',
    content: '',
    isNoti: cPost,
    result:false
  
})
const handleChange = (prop: keyof IPost) => (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(values.title)
  setValues({ ...values, [prop]: event.target.value })
  console.log(values.title)
}
  console.log('end')
  useEffect(() => {
    console.log('end')
    bootstrap.network.getOnePost(cPost, (poost) => {
      if (poost) {
        setPostas(poost)
        setValues({ ...values, ['title']: poost[0].post_title })
        setValues({ ...values, ['content']: poost[0].post_contents })
        console.log(poost)
      }
    })
  },[])
  const clickHandler = (e) => {
    e.preventDefault();
    const isValidTitle = values.title !== ''
    const isValidContent = values.content !== ''

    if (isValidTitle === ttFieldEmpty) setTtFieldEmpty(!ttFieldEmpty)
    if (isValidContent === ctFieldEmpty) setCtFieldEmpty(!ctFieldEmpty)

    if (isValidTitle && isValidContent) {
        const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
 
        
        bootstrap.network.modifyPost(values, (message)=>{
          if (message) {
            dispatch(closemodifyPostOpen())
          }
        })
      
    }
  }
  return (
    
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closemodifyPostOpen())}
        >
          <CloseIcon />
        </IconButton>
        
          {Postas.map((post) => {
            const {
              id,
              member_id,
              post_title,
              post_contents,
              post_isNoti,
              post_create_date,
              post_modify_date,
            } = post
            if (post_isNoti === 1) {
              noti = true
            } else if (post_isNoti === 0) {
              noti = false
            }
            console.log(values);
            return (
              <div>
                <div>
                  {noti && <div>공지</div>}
                  {!noti && <div>일반</div>}
                  <div>생성일: {post_create_date}</div>
                  <div>수정일: {post_modify_date}</div>
                  <div>작성자: {member_id}</div>
                </div>
                <WhiteboardWrapper>
                <Content>
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '100ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                    <TextField
              autoFocus
              fullWidth
              label="제목"
              variant="outlined"
              color="secondary"
              defaultValue={post_title}
              error={ttFieldEmpty}
              helperText={ttFieldEmpty && '제목이 필요합니다.'}
              onChange={handleChange('title')}
            />
            
            <TextField
              autoFocus
              fullWidth
              label="내용"
              variant="outlined"
              color="secondary"
              defaultValue={post_contents}
              multiline
              rows={4}
              error={ctFieldEmpty}
              helperText={ctFieldEmpty && '내용 필요합니다.'}
              onChange={handleChange('content')}
            />
                    </div>
                  </Box>
                </Content>
                </WhiteboardWrapper>
              </div>
            )
          })}
          <Button variant="text" onClick={(e)=>{clickHandler(e)}}>수정</Button>
      </Wrapper>
    </Backdrop>
  )
}
