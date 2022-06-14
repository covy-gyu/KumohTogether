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
import {closeWhiteboardDialog, openNewPostOpen,openOnePostOpen,setCashPost,openmodifyPostOpen } from '../stores/WhiteboardStore'
import {setAdminMode ,setUserId,setAdminModiMode} from '../stores/UserStore'
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 16px 180px 16px 16px;
`
const Scroll = styled.div`
  width: 100%;
  height: 90%;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  overflow-y: auto;
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
export default function MemberListDialog() {
  
  let uid=0;
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [userList, setUserList] = useState([])
  
  useEffect(()=>{
    bootstrap.network.getUsers((post)=>{
      if (post) {
        setUserList(post);
        console.log(post)
        console.log(userList)
      }
    })
    console.log("in")
    navigator.mediaDevices.enumerateDevices()
  },[])
  const clickHandler = (params, e) => {
    console.log(params); // error
    e.preventDefault();
    bootstrap.network.deleteUser(params, (result)=>{
        if (result) {         
          dispatch(setAdminMode(false));        
          dispatch(setAdminMode(true));      
        }
      })
  }
   const clickHandler2 = (params, e) => {
     e.preventDefault();
     console.log(params)
     console.log(userList)
     dispatch(setUserId(params));
     dispatch(setAdminMode(false));
     dispatch(setAdminModiMode(true));
   }
  return (
    <Backdrop>
      <Wrapper>
        
        
          <WhiteboardWrapper>
            <Scroll>
          <Table>
           <TableHead>
             <TableRow>
               <TableCell>이름</TableCell>
               <TableCell>구분</TableCell>
               <TableCell>닉네임</TableCell>
               <TableCell>학과</TableCell>
               <TableCell></TableCell>
               <TableCell></TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {userList.map((user) => {
               const { id,member_id,member_identification,member_name,member_nick,member_social_num,department_name } = user
               
               return (
                 <TableRowWrapper key={id}>
                   <TableCell>
                     <div>{member_name}</div>
                   </TableCell>
                   <TableCell>
                   <div>{member_identification}</div>
                   </TableCell>
                   <TableCell>
                     <div>{member_nick}</div>
                   </TableCell>
                   <TableCell>{department_name}</TableCell>
                   <TableCell><Button variant="text" onClick={(e)=>{clickHandler2(id, e)}}>수정</Button></TableCell> 
                   <TableCell><Button variant="text" onClick={(e)=>{clickHandler(id, e)}}>삭제</Button></TableCell>
                   </TableRowWrapper>
                 )
               })}
             </TableBody>
           </Table>
           </Scroll>
          </WhiteboardWrapper>
          
      </Wrapper>
    </Backdrop>
  )
}
