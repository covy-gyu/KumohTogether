import React, {useEffect,useState} from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Button from '@mui/material/Button'
import Bootstrap from '../scenes/Bootstrap'
import phaserGame from '../PhaserGame'
import NewPost from './NewPost'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeWhiteboardDialog, openNewPostOpen,openOnePostOpen,setCashPost,openmodifyPostOpen } from '../stores/WhiteboardStore'

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

const ButtonWrapper = styled.div`
  
  overflow: hidden;
  iframe {
    width: 30%;
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
export default function WhiteboardDialog() {
  
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const userIdb = useAppSelector((state) => state.user.suser)
  let CheckAuthor =false;
  let CheckNoti =false;
  let cid=0;
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [PostList, setPostList] = useState([])
  
  useEffect(()=>{
    bootstrap.network.getPosts((post)=>{
      if (post) {
        setPostList(post);
        console.log(post)
        console.log(PostList)
      }
    })
    console.log("in")
    navigator.mediaDevices.enumerateDevices()
  },[])
  function makeNewPost(){
    console.log('a')
    dispatch(closeWhiteboardDialog())
    dispatch(openNewPostOpen())
  }
  const clickHandler = (params, e) => {
    console.log(params); // error
    e.preventDefault();
    bootstrap.network.deletePost(params, (result)=>{
        if (result) {
          
          dispatch(closeWhiteboardDialog());
          
          
        }
      })
  }
  const clickHandler2 = (params, e) => {
    e.preventDefault();
    dispatch(setCashPost(params));
    dispatch(closeWhiteboardDialog());
    dispatch(openmodifyPostOpen());
  }
  const clickHandler3 = (params, e) => {
    e.preventDefault();
    dispatch(setCashPost(params));
    dispatch(closeWhiteboardDialog());
    dispatch(openOnePostOpen());
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
               <TableCell>구분</TableCell>
               <TableCell>제목</TableCell>
               <TableCell>작성자</TableCell>
               <TableCell>작성일</TableCell>
               <TableCell>수정일</TableCell>
               <TableCell></TableCell>
               <TableCell></TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {PostList.map((post) => {
               const { id,member_id,post_title,post_contents,post_isNoti,post_create_date,post_modify_date } = post
               if(member_id===userIdb)
               {
                CheckAuthor=true
               }
               else{
                CheckAuthor=false
               }
               if(post_isNoti===1)
               {
                CheckNoti=true
               }
               else if(post_isNoti===0){
                CheckNoti=false
               }
               return (
                 <TableRowWrapper key={id}>
                   <TableCell>
                     <div>{(CheckNoti&&'공지')||(!CheckNoti&&'일반')}</div>
                   </TableCell>
                   <TableCell>
                   <Button variant="text" onClick={(e)=>{clickHandler3(id, e)}}>{post_title}</Button>
                   </TableCell>
                   <TableCell>
                     <div>{member_id}</div>
                   </TableCell>
                   <TableCell>{post_create_date}</TableCell>
                   <TableCell>{post_modify_date}</TableCell>
                   <TableCell>{CheckAuthor&&<Button variant="text" onClick={(e)=>{clickHandler2(id, e)}}>수정</Button>}</TableCell>
                   <TableCell>{CheckAuthor&&<Button variant="text" onClick={(e)=>{clickHandler(id, e)}}>삭제</Button>}</TableCell>
                   </TableRowWrapper>
                 )
               })}
             </TableBody>
           </Table>
          </WhiteboardWrapper>
          <ButtonWrapper>
            <Button variant="contained" onClick={makeNewPost}>게시글 작성</Button>
          </ButtonWrapper>
          
      </Wrapper>
    </Backdrop>
  )
}
