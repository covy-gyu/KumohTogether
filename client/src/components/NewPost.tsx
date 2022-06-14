import React, {useEffect,useState} from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Bootstrap from '../scenes/Bootstrap'
import phaserGame from '../PhaserGame'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeNewPostOpen } from '../stores/WhiteboardStore'
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
export default function NewPost() {
  
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const userIda = useAppSelector((state) => state.user.suser)
  
  
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [PostList, setPostList] = useState([])
  const [ttFieldEmpty, setTtFieldEmpty] = useState<boolean>(false)
  const [ctFieldEmpty, setCtFieldEmpty] = useState<boolean>(false)
  const [values, setValues] = useState<IPost>({
  
        memberId: userIda,
        title: '',
        content: '',
        isNoti: 0,
        result:false
      
  })
  const handleChange = (prop: keyof IPost) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidTitle = values.title !== ''
    const isValidContent = values.content !== ''

    if (isValidTitle === ttFieldEmpty) setTtFieldEmpty(!ttFieldEmpty)
    if (isValidContent === ctFieldEmpty) setCtFieldEmpty(!ctFieldEmpty)

    if (isValidTitle && isValidContent) {
        const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
 
        
        bootstrap.network.registerPost(values, (message)=>{
          if (message) {
            dispatch(closeNewPostOpen())
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
          onClick={() => dispatch(closeNewPostOpen())}
        >
          <CloseIcon />
        </IconButton>
        
          <WhiteboardWrapper onSubmit={handleRegister}>
          <Title>게시글 작성</Title>
          <Content onSubmit={handleRegister}>
            <TextField
              autoFocus
              fullWidth
              label="제목"
              variant="outlined"
              color="secondary"
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
              multiline
              rows={4}
              error={ctFieldEmpty}
              helperText={ctFieldEmpty && '내용 필요합니다.'}
              onChange={handleChange('content')}
            />
            <FormControl >
            <FormLabel id="demo-controlled-radio-buttons-group">구분</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={handleChange('isNoti')}
            >
            <FormControlLabel value='1' control={<Radio />} label="공지" />
            <FormControlLabel value='0' control={<Radio />} label="일반" />
            </RadioGroup>
            </FormControl>
            <Button variant="contained" color="secondary" type="submit">
              등록
            </Button>
          </Content>
          </WhiteboardWrapper>
          
      </Wrapper>
    </Backdrop>
  )
}
