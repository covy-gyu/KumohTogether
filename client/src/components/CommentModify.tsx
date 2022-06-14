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
import { closeComentModOpen ,openOnePostOpen} from '../stores/WhiteboardStore'

import { IPost } from '../../../types/Post'
import { IComment } from '../../../types/Comment'
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
export default function CommentModify() {
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const cashComment = useAppSelector((state) => state.whiteboard.cashComment)
  const cashPost = useAppSelector((state) => state.whiteboard.cashPost)
  const userId = useAppSelector((state) => state.user.suser)
  let noti = false
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [Comments, setComments] = useState([])
  const [ctFieldEmpty, setCtFieldEmpty] = useState<boolean>(false)
  const [values, setValues] = useState<IComment>({
    id:cashComment,
    user_id: userId,
    content: '',
    post_id: cashPost
  
})
const handleChange = (prop: keyof IComment) => (event: React.ChangeEvent<HTMLInputElement>) => {
  setValues({ ...values, [prop]: event.target.value })
}
  useEffect(() => {
    bootstrap.network.getOneComment(cashComment, (poost) => {
      if (poost) {
        setComments(poost)
        console.log(poost)
      }
    })
  },[])
  const clickHandler = (e) => {
    e.preventDefault();
    console.log(cashPost);
    const isValidContent = values.content !== ''

    if (isValidContent === ctFieldEmpty) setCtFieldEmpty(!ctFieldEmpty)

    if (isValidContent) {
        const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
 
        console.log(values)
        bootstrap.network.modifyComment(values, (message)=>{
          if (message) {
            dispatch(closeComentModOpen())
            dispatch(openOnePostOpen())
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
          onClick={() => dispatch(closeComentModOpen())}
        >
          <CloseIcon />
        </IconButton>
        
          {Comments.map((comment) => {
            const {
              comment_contents
            } = comment
            console.log(values);
            return (
              <div>

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
              label="내용"
              variant="outlined"
              color="secondary"
              defaultValue={comment_contents}
              
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
