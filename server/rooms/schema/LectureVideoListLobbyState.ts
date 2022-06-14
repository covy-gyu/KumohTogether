import { Schema, type } from '@colyseus/schema'

import { ILectureVideoListState } from '../../../types/ILectureVideoListState'

export class LectureVideoListLobbyState extends Schema implements ILectureVideoListState {
    @type('string') userId = ''
}