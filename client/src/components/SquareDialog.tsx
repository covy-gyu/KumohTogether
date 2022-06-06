import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import phaserGame from '../PhaserGame'
import Square from '../scenes/Square'
import { useAppSelector } from '../hooks'
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

  const square = phaserGame.scene.keys.square as Square
  const game = phaserGame.scene.keys.game as Game
  
  let [ alert, alertSet ] = useState(true);
  useEffect(()=>{
    square.myPlayer.setPlayerName(userName)
    square.myPlayer.setPlayerTexture(userAvatar)
    square.network.readyToConnect()
    
    let timer = setTimeout(()=>{ 
      alertSet(false)
      
    }, 2000);
    return ()=>{ clearTimeout(timer)}
  },[alert] );
  
  return (
    <div>
    {alert === true  ? <Title> 금오광장 </Title> : null }
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