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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {setAdminMode ,setUserId,setAdminModiMode} from '../stores/UserStore'

import { IMemberModi } from '../../../types/MemberModi'
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
export default function MemberModifyDialog() {
  const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  const cmember = useAppSelector((state) => state.user.userId)

  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [user, setUser] = useState([])
  const [depart, setDepart] = useState([])
  const [FieldEmpty, setFieldEmpty] = useState<boolean>(false)
  const [aFieldEmpty, setAFieldEmpty] = useState<boolean>(false)
  const [bFieldEmpty, setBFieldEmpty] = useState<boolean>(false)
  const [cFieldEmpty, setCFieldEmpty] = useState<boolean>(false)
  const [values, setValues] = useState<IMemberModi>({
    id: cmember,
    member_id: '',
    member_identification: '',
    member_name: '',
    member_nick: '',
    department_name: '',
  })
  const [age, setAge] = React.useState('');
  const handleChange =
    (prop: keyof IMemberModi) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }
  console.log('end')
  useEffect(() => {
    console.log('end')
    bootstrap.network.getOneMember(cmember, (poost) => {
      if (poost) {
        setUser(poost)
        console.log(poost)
      }
    })
    bootstrap.network.disPlayDepart((poosst) => {
      if (poosst) {
        setDepart(poosst)
        console.log(poosst)
      }
    })
  }, [])
  console.log(depart)
  const clickHandler = (e) => {
    e.preventDefault()
    const isValidName = values.member_name !== ''
    const isValidNick = values.member_nick !== ''
    const isValidIden = values.member_identification !== ''
    const isValidDn = values.department_name !== ''

    if (isValidName === FieldEmpty) setFieldEmpty(!FieldEmpty)
    if (isValidNick === aFieldEmpty) setAFieldEmpty(!aFieldEmpty)
    if (isValidIden === bFieldEmpty) setBFieldEmpty(!bFieldEmpty)
    if (isValidDn === cFieldEmpty) setCFieldEmpty(!cFieldEmpty)

    if (isValidName && isValidNick && isValidIden && isValidDn) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

      bootstrap.network.modifyUser(values, (message) => {
        if (message) {
          alert('success')
        }
      })
    }
  }
  const handleChange2 = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
    setValues({ ...values, ['department_name']: event.target.value })
    
  };
 
  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => { dispatch(setAdminMode(true));
            dispatch(setAdminModiMode(false));}}
        >
          <CloseIcon />
        </IconButton>

        {user.map((uuser) => {
          console.log(uuser)
          const {
            id,
            member_id,
            member_identification,
            member_name,
            member_nick,
            department_name,
          } = uuser
          console.log(id)
          console.log(member_id)
          console.log(member_identification)
          console.log(member_name)
          console.log(member_nick)
          console.log(department_name)
          return (
            <div>
              <div>
                <div>Id: {member_id}</div>
              </div>
              <WhiteboardWrapper>
                <Content>
                  <div>
                    <TextField
                      autoFocus
                      fullWidth
                      label="이름"
                      variant="outlined"
                      color="secondary"
                      defaultValue={member_name}
                      error={FieldEmpty}
                      helperText={FieldEmpty && '이름이 필요합니다.'}
                      onChange={handleChange('member_name')}
                    />
                    <TextField
                      autoFocus
                      fullWidth
                      label="닉네임"
                      variant="outlined"
                      color="secondary"
                      defaultValue={member_nick}
                      error={aFieldEmpty}
                      helperText={aFieldEmpty && '닉네임이 필요합니다.'}
                      onChange={handleChange('member_nick')}
                    />
                    <TextField
                      autoFocus
                      fullWidth
                      label="구분"
                      variant="outlined"
                      color="secondary"
                      defaultValue={member_identification}
                      error={bFieldEmpty}
                      helperText={bFieldEmpty && '구분이 필요합니다.'}
                      onChange={handleChange('member_identification')}
                    />
                    {/* <TextField
                      autoFocus
                      fullWidth
                      label="학과"
                      variant="outlined"
                      color="secondary"
                      defaultValue={department_name}
                      error={cFieldEmpty}
                      helperText={cFieldEmpty && '학과가 필요합니다.'}
                      onChange={handleChange('department_name')}
                    /> */}
                    <InputLabel id="demo-simple-select-label">학과</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="학과"
                      onChange={handleChange2}
                    >
                    {depart.map((ddepart) => {
                        const {
                            id,
                            department_name,
                          } = ddepart
                          return (
                            <MenuItem value={department_name}>{department_name}</MenuItem>
                          )
                    })}
                    
                    </Select>
                  </div>
                </Content>
              </WhiteboardWrapper>
            </div>
          )
        })}
        <Button
          variant="text"
          onClick={(e) => {
            clickHandler(e)
          }}
        >
          수정
        </Button>
      </Wrapper>
    </Backdrop>
  )
}
