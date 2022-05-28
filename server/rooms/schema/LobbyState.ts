import { Schema, type } from '@colyseus/schema'

import { ILobbyState } from '../../../types/ILobbyState'

export class LobbyState extends Schema implements ILobbyState {
    @type('string') id = ''
    @type('string') password = ''
    @type('boolean') result = false
}