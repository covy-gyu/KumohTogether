import { Schema } from '@colyseus/schema'

export interface IPostState extends Schema{
    id: string
    memberId: number
    title: string
    content: string
    isNoti: number
  }