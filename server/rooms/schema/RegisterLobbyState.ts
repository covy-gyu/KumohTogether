import { Schema, type } from '@colyseus/schema'

import { IRegisterMem } from '../../../types/IRegisterMem'

export class RegisterLobbyState extends Schema implements IRegisterMem {
    @type('string') id = ''
    @type('string') password = ''
    @type('string') identification = ''
    @type('string') name = ''
    @type('string') nickname = ''
    @type('string') socialNum = ''
    @type('string') department = ''
}