import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import phaserGame from '../PhaserGame'
import Square from '../scenes/Square'
import { useAppDispatch, useAppSelector } from '../hooks'
import Game from '../scenes/Game'
import { phaserEvents } from '../events/EventCenter'

const Title = styled.h1`
  font-size: 50px;
  color: #000;
  text-align: center;
`

export default function SquareDialog() {
  const userName = useAppSelector((state) => state.logInfo.userName)
  const userAvatar = useAppSelector((state) => state.logInfo.userAvatar)
  const location = useAppSelector((state)=> state.chat.location)
  const userlocation = useAppSelector((state)=> state.chat.location)
  const dispatch = useAppDispatch()
  const [content, setContent] = useState('')


  const game = phaserGame.scene.keys.game as Game
  const square = phaserGame.scene.keys.square as Square
  let [ alert, alertSet ] = useState(true);
  useEffect(()=>{
    if(location){
      if(location==='square'){
        square.myPlayer.setPlayerName(userName)
        square.myPlayer.setPlayerTexture(userAvatar)
        square.network.readyToConnect()
        square.network.videoConnected()
        setContent('금오광장')
      }
      else if(location==='digital'){
        game.myPlayer.setPlayerName(userName)
        game.myPlayer.setPlayerTexture(userAvatar)
        game.network.readyToConnect()
        game.network.videoConnected()
        setContent('디지털관')
      }
    }
  
    let timer = setTimeout(()=>{ 
      alertSet(false)
      
    }, 2000);
    return ()=>{ clearTimeout(timer)}
  },[alert] );
  
  return (
    <div>
    {alert === true  ? <Title> {content} </Title> : null }
    </div>
    
    
    
    )
    

   
  
}

// {
//   alert === true
//   ? (<div className="my-alert2">
//       <p>재고가 얼마 남지 않았습니다</p>
//     </div>)
//   : null
// }