import { Schema } from '@colyseus/schema'

export interface ICommentState extends Schema{
  id:number
    user_id: string
    content: string
    post_id: number
  }