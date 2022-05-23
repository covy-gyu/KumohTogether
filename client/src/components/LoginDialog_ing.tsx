export {}
// import React, { useState } from 'react'
// import styled from 'styled-components'
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import Visibility from '@mui/icons-material/Visibility'
// import VisibilityOff from '@mui/icons-material/VisibilityOff'

// import { IRoomData } from '../../../types/Rooms'
// import { useAppSelector } from '../hooks'

// import phaserGame from '../PhaserGame'
// import Bootstrap from '../scenes/Bootstrap'
// import { IUser } from '../../../types/Users'

// const CreateRoomFormWrapper = styled.form`
//   display: flex;
//   flex-direction: column;
//   width: 320px;
//   gap: 20px;
// `

// export default function LoginDialog() {
//   const [values, setValues] = useState<IUser>({
//     ID: '',
//     password: '',
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [IDFieldEmpty, setIDFieldEmpty] = useState(false)
//   const [passwordFieldEmpty, setPasswordFieldEmpty] = useState(false)
//   const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)

//   const handleChange = (prop: keyof IUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValues({ ...values, [prop]: event.target.value })
//   }

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     const isValidID = values.ID !== ''
//     const isValidPassword = values.password !== ''
//     const loginResult = false

//     if (isValidID === IDFieldEmpty) setIDFieldEmpty(!IDFieldEmpty)
//     else if (isValidPassword === passwordFieldEmpty){
//       setPasswordFieldEmpty(!passwordFieldEmpty)
//     }
//     else {
//       const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
//       bootstrap.network
//         .createCustom(values)
//         .then(() => bootstrap.launchGame())
//         .catch((error) => console.error(error))
//     }
    

//     // create custom room if name and description are not empty
//     if (isValidID && isValidPassword && lobbyJoined) {
//       const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
//       bootstrap.network
//         .createCustom(values)
//         .then(() => bootstrap.launchGame())
//         .catch((error) => console.error(error))
//     }
//     // else if (lobbyJoined) {
//     //   const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
//     //   bootstrap.network
//     //     .joinOrCreatePublic()
//     //     .then(() => bootstrap.launchGame())
//     //     .catch((error) => console.error(error))
//     // } else {
//     //   setShowSnackbar(true)
//     // }
//   }

//   return (
//     <CreateRoomFormWrapper onSubmit={handleSubmit}>
//       <TextField
//         label="ID"
//         variant="outlined"
//         color="secondary"
//         autoFocus
//         error={IDFieldEmpty}
//         helperText={IDFieldEmpty && 'ID is required'}
//         onChange={handleChange('ID')}
//       />

//       <TextField
//         type={showPassword ? 'text' : 'password'}
//         label="Password"
//         onChange={handleChange('password')}
//         color="secondary"
//         autoFocus
//         error={IDFieldEmpty}
//         helperText={IDFieldEmpty && 'Password is required'}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="비밀번호 보기"
//                 onClick={() => setShowPassword(!showPassword)}
//                 edge="end"
//               >
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />
//       <Button variant="contained" color="secondary" type="submit">
//         Connect by log-in
//       </Button>
//     </CreateRoomFormWrapper>
//   )
// }