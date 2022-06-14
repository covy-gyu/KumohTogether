import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import AlarmIcon from '@mui/icons-material/Alarm';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Bootstrap from '../scenes/Bootstrap'
import phaserGame from '../PhaserGame'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeOnePostOpen, openOnePostOpen,setCashComment,openComentModOpen } from '../stores/WhiteboardStore'
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
const Scroll = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  overflow-y: auto;
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
export default function OnePostDialog() {
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const cPost = useAppSelector((state) => state.whiteboard.cashPost)
  const userIda = useAppSelector((state) => state.user.suser)
  const onePostOpen = useAppSelector((state) => state.whiteboard.onePostOpen)
  let noti = false
  let CheckAuthorComment = false
  const [text, settext] = useState('')
  const [openModify, setopenModify] = useState(false)
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [cmFieldEmpty, setCmFieldEmpty] = useState(Boolean)
  const [Postas, setPostas] = useState([])
  const [CommentList, setCommentList] = useState([])
  const [modifyData, setmodifyData] = useState('')
  const [values, setValues] = useState<IComment>({
    id:-1,
    user_id: userIda,
    content: '',
    post_id: cPost,
  })
  const handleChange = (prop: keyof IComment) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const clickHandleras = (e) => {
    console.log('clisck!')
    bootstrap.network.dump((result) => {
      if (result) {
        console.log(result)
        dispatch(closeOnePostOpen())
        dispatch(openOnePostOpen())
      }
    })
  }
  console.log('end')
  useEffect(() => {
    console.log('end')
    bootstrap.network.getOnePost(cPost, (poost) => {
      if (poost) {
        setPostas(poost)
        console.log(poost)

        console.log('end')
      }
    })
    bootstrap.network.displayComment(cPost, (pooost) => {
      if (pooost) {
        setCommentList(pooost)
        console.log(pooost)

        console.log('end')
      }
    })
  }, [])
  const clickHandler = (params, e) => {
    console.log(params) // error
    e.preventDefault()
    bootstrap.network.deleteComment(params, (result) => {
      if (result) {
        dispatch(closeOnePostOpen())
        dispatch(openOnePostOpen())
      }
    })
  }
  const clickHandler2 = (params,e) => {
    e.preventDefault();
    console.log(cPost);
    dispatch(setCashComment(params));
    dispatch(closeOnePostOpen())
    dispatch(openComentModOpen())
  }

  function RegisterComment() {
    const isValidContent = values.content !== ''

    if (isValidContent === cmFieldEmpty) setCmFieldEmpty(!cmFieldEmpty)

    if (isValidContent) {
      bootstrap.network.registerComment(values, (message) => {
        if (message) {
          dispatch(closeOnePostOpen())
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
          onClick={() => dispatch(closeOnePostOpen())}
        >
          <CloseIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="add an alarm"onClick={(e) => {
                                clickHandleras(e)
                              }}>
        <AlarmIcon />
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
                        value={post_title}
                        disabled
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        label="내용"
                        multiline
                        rows={4}
                        value={post_contents}
                        disabled
                      />
                    </div>
                  </Box>
                </Content>
              </WhiteboardWrapper>
            </div>
          )
        })}
        <Scroll>
          <List sx={{ width: '100%', maxWidth: 360 }}>
            {CommentList.map((comment) => {
              const { id, member_id, comment_contents, comment_create_date, comment_modify_date } =
                comment
              if (member_id === userIda) {
                CheckAuthorComment = true
              } else {
                CheckAuthorComment = false
              }
              return (
                <div>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={comment_contents}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {member_id}
                          </Typography>
                          {' — 작성일:'}
                          {comment_create_date}
                          {' - 수정일:'}
                          {comment_modify_date}
                          {CheckAuthorComment && (
                            <Button
                              variant="text"
                              onClick={(e) => {
                                clickHandler(id, e)
                              }}
                            >
                              삭제
                            </Button>
                          )}
                          {CheckAuthorComment && (
                            <Button
                              variant="text"
                              onClick={(e) => {
                                clickHandler2(id, e)
                              }}
                            >
                              수정
                            </Button>
                          )}
                          
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
          </List>
        </Scroll>
        
        <TextField
          autoFocus
          fullWidth
          label="댓글"
          variant="outlined"
          color="secondary"
          error={cmFieldEmpty}
          helperText={cmFieldEmpty && '댓글이 필요합니다.'}
          onChange={handleChange('content')}
        />
        <Button variant="text" onClick={RegisterComment}>
          등록
        </Button>
      </Wrapper>
    </Backdrop>
  )
}
