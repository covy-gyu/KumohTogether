import { Schema } from '@colyseus/schema'

export interface IRegisterMem extends Schema{
    id: string
    password: string
    identification: string
    name: string
    nickname: string
    socialNum: string
    department: string
  }