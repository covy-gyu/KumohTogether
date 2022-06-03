import { ItemType } from '../../../types/Items'
import Network from '../services/Network'
import store from '../stores'
import { openRoomTableDialog } from '../stores/PrivateRoomStore'
import Item from './Item'

export default class VendingMachine extends Item {
  openDialog() {
    store.dispatch(openRoomTableDialog())
  }
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.VENDINGMACHINE
  }

  onOverlapDialog() {
    this.setDialogBox('Press R to buy a coffee :)')
  }
}
