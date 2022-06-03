import { ItemType } from '../../../types/Items'
import Item from './Item'
import store from '../stores'
import { openDoor } from '../stores/DoorStore'
import Network from '../services/Network'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

export default class Door extends Item {
//   itemDirection?: string

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.DOOR
  }

  changeScene(network:Network) {
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

    this.setDialogBox('hello')
    store.dispatch(openDoor('square'))
    // network.joinOrCreateSquare()
    // .then(() => bootstrap.launchSquare())
    // .catch((error) => console.error(error))
  }
}
