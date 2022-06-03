import { ItemType } from '../../../types/Items'
import Item from './Item'
import Network from '../services/Network'

export default class Door extends Item {
//   itemDirection?: string

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.DOOR
  }

  onOverlapDialog(network: Network) {
    this.setDialogBox('hello')
    //network.joinOrCreateSquare()
  }
}
