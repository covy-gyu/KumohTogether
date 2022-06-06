import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ISquareState } from '../../../../types/ISquareState'

type Payload = {
  client: Client
  computerId: string
}

export class ComputerAddUserCommand extends Command<ISquareState, Payload> {
  execute(data: Payload) {
    const { client, computerId } = data
    const computer = this.room.state.computers.get(computerId)
    const clientId = client.sessionId

    if (!computer || computer.connectedUser.has(clientId)) return
    computer.connectedUser.add(clientId)
  }
}

export class ComputerRemoveUserCommand extends Command<ISquareState, Payload> {
  execute(data: Payload) {
    const { client, computerId } = data
    const computer = this.state.computers.get(computerId)

    if (computer.connectedUser.has(client.sessionId)) {
      computer.connectedUser.delete(client.sessionId)
    }
  }
}
