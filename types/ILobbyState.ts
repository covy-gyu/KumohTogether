import { Schema } from '@colyseus/schema'

export interface ILobbyState extends Schema{
    id: string
    password: string
    result: boolean
  }