import React, { useState,useEffect } from 'react'
import logo from '../assets/logo.png'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useAppDispatch, useAppSelector } from '../hooks'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { InputAdornment, TextField } from '@mui/material'
import { IMember } from '../../../types/Members'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import store from '../stores'
import { setLoggedSuccess, setRegistermode,setSuser,setAdminMode} from '../stores/UserStore'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'


const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.form`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
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

export default function MemberRegister() {
  const dispatch = useAppDispatch()
  const loggedSuccesss = useAppSelector((state) => state.user.loggedSuccess)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const [idFieldEmpty, setIdFieldEmpty] = useState<boolean>(false)
  const [pwFieldEmpty, setPwFieldEmpty] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSocialNum, setShowSocialNum] = useState(false)
  const [snFieldEmpty, setSnFieldEmpty] = useState<boolean>(false)
  const [nnFieldEmpty, setNnFieldEmpty] = useState<boolean>(false)
  const [uiFieldEmpty, setUiFieldEmpty] = useState<boolean>(false)
  const [dpFieldEmpty, setDpFieldEmpty] = useState<boolean>(false)
  const [nmFieldEmpty, setNmFieldEmpty] = useState<boolean>(false)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [age, setAge] = React.useState('');
  const [depart, setDepart] = useState([])
  const [values, setValues] = useState<IMember>({
    id: '',
    password: '',
    identification: '',
    name: '',
    nickname: '',
    socialNum: '',
    department: '',
    result: false
  })
  useEffect(() => {
    bootstrap.network.disPlayDepart((poosst) => {
      if (poosst) {
        setDepart(poosst)
        console.log(poosst)
      }
    })
  }, [])
  const handleChange = (prop: keyof IMember) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleChange2 = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    setValues({ ...values, ['department']: event.target.value })
    
  };
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidId = values.id !== ''
    const isValidPassword = values.password !== ''
    const isValidIdentification = values.identification !== ''
    const isValidName = values.name !== ''
    const isValidNickname = values.nickname !== ''
    const isValidSocialNum = values.socialNum !== ''
    const isValidDepartment = values.department !== ''

    if (isValidId === idFieldEmpty) setIdFieldEmpty(!idFieldEmpty)
    if (isValidPassword === pwFieldEmpty) setPwFieldEmpty(!pwFieldEmpty)
    if (isValidIdentification === uiFieldEmpty) setUiFieldEmpty(!uiFieldEmpty)
    if (isValidName === nmFieldEmpty) setNmFieldEmpty(!nmFieldEmpty)
    if (isValidNickname === nnFieldEmpty) setNnFieldEmpty(!nnFieldEmpty)
    if (isValidSocialNum === snFieldEmpty) setSnFieldEmpty(!snFieldEmpty)
    if (isValidDepartment === dpFieldEmpty) setDpFieldEmpty(!dpFieldEmpty)

    if (isValidId && isValidPassword && lobbyJoined) {
      dispatch(setLoggedSuccess(false))
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
 console.log(values)
      const register = false
      bootstrap.network.registerMember(values, (register)=>{
        if (register) {
          store.dispatch(setRegistermode(false))
        }
      })
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}
      >
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}
        >
          Trying to connect to server, please try again!
        </Alert>
      </Snackbar>
      <Backdrop>

        <Wrapper onSubmit={handleRegister}>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(setRegistermode(false))}
        >
          <CloseIcon />
        </IconButton>
          <Title>회원가입</Title>
          <Content onSubmit={handleRegister}>
            <TextField
              autoFocus
              fullWidth
              label="id"
              variant="outlined"
              color="secondary"
              error={idFieldEmpty}
              helperText={idFieldEmpty && 'ID가 필요합니다.'}
              onChange={handleChange('id')}
            />
            <TextField
              type={showPassword ? 'text' : 'password'}
              autoFocus
              fullWidth
              label="password"
              variant="outlined"
              color="secondary"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={pwFieldEmpty}
              helperText={pwFieldEmpty && '비밀번호가 필요합니다.'}
              onChange={handleChange('password')}
            />
            <TextField
              type={showSocialNum ? 'text' : 'password'}
              autoFocus
              fullWidth
              label="주민등록번호"
              variant="outlined"
              color="secondary"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowSocialNum(!showSocialNum)}
                      edge="end"
                    >
                      {showSocialNum ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={snFieldEmpty}
              helperText={snFieldEmpty && '주민등록번호가 필요합니다.'}
              onChange={handleChange('socialNum')}
            />
            <TextField
              autoFocus
              fullWidth
              label="닉네임"
              variant="outlined"
              color="secondary"
              error={nnFieldEmpty}
              helperText={nnFieldEmpty && '닉네임이 필요합니다.'}
              onChange={handleChange('nickname')}
            />
            <TextField
              autoFocus
              fullWidth
              label="이름"
              variant="outlined"
              color="secondary"
              error={nmFieldEmpty}
              helperText={nmFieldEmpty && '이름이 필요합니다.'}
              onChange={handleChange('name')}
            />
            <TextField
              autoFocus
              fullWidth
              label="구분"
              variant="outlined"
              color="secondary"
              error={uiFieldEmpty}
              helperText={uiFieldEmpty && '구분이 필요합니다.'}
              onChange={handleChange('identification')}
            />
            {/* <TextField
              autoFocus
              fullWidth
              label="학과"
              variant="outlined"
              color="secondary"
              error={dpFieldEmpty}
              helperText={dpFieldEmpty && '학과가 필요합니다.'}
              onChange={handleChange('department')}
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
            <Button variant="contained" color="secondary" type="submit">
              회원가입
            </Button>
          </Content>
        </Wrapper>
      </Backdrop>
    </>
  )
}
