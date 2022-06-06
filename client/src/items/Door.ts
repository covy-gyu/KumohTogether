import { ItemType } from '../../../types/Items'
import Item from './Item'
import store from '../stores'
import { openDoor } from '../stores/DoorStore'
import Network from '../services/Network'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Square from '../scenes/Square'
import Game from '../scenes/Game'
import { setLoggedIn } from '../stores/UserStore'

export default class Door extends Item {
//   itemDirection?: string

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.DOOR
  }
  userInfo(userName,userAvatar){
    const square = phaserGame.scene.keys.square as Square

    square.myPlayer.setPlayerName(userName)
    square.myPlayer.setPlayerTexture(userAvatar)
  }
  async changeScene(network:Network) {

    console.log('changeScence')
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    const game = phaserGame.scene.keys.game as Game

    const square = phaserGame.scene.keys.square as Square
    const userName = ''
    const userAvatar =''
  
    console.log(userName)
    console.log(userAvatar)
   
    this.setDialogBox('square')
    // store.dispatch(openDoor('square'))
    network.joinOrCreateSquare()
    .then(() => bootstrap.launchSquare())
    .catch((error) => console.error(error))
  }
  setPlayerInfo(callback:(name:string,avatar:string)=>void){
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

    let n = bootstrap.logInfo.getUserName()
    let a = bootstrap.logInfo.getUserAvatar()
    console.log(n,a)
    callback(n,a)

  }
}
