import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ISquareState } from '../../../../types/ISquareState'

type Payload = {
  client: Client
  name: string
}

export default class PlayerUpdateNameCommand extends Command<ISquareState, Payload> {
  execute(data: Payload) {
    const { client, name } = data

    const player = this.room.state.players.get(client.sessionId)

    if (!player) return
    player.name = name
  }
}
