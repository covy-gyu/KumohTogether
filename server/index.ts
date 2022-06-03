import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'

// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/SkyOffice'
import { Lobby } from './rooms/Lobby'

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

const server = http.createServer(app)
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, Lobby, {
  id: '',
  password: '',
  result: false,
  msg: '',
  code: 0
})
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: 'Kumoh Square',
  description: '🚩 친구 만들거나 회의, 수업을 들어보세요 💙',
  password: null,
  autoDispose: false,
})
gameServer.define(RoomType.SQUARE, SkyOffice, {
  name: 'Kumoh Square',
  description: '🚩 여기는 디관앞, 금오광장입니다 💙',
  password: null,
  autoDispose: false,
})
gameServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
