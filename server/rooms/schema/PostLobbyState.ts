import { Schema, type } from '@colyseus/schema'

import { IPostState } from '../../../types/IPostState'

export class PostLobbyState extends Schema implements IPostState {
    @type('string') id = ''
    @type('number') memberId = 0
    @type('string') title = ''
    @type('string') content = ''
    @type('number') isNoti = 0
}