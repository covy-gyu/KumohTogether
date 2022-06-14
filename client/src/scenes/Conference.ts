 import Phaser from 'phaser'

// import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'

import Item from '../items/Item'

import '../characters/MyPlayer'
import '../characters/OtherPlayer'
import MyPlayer from '../characters/MyPlayer'
import OtherPlayer from '../characters/OtherPlayer'
import PlayerSelector from '../characters/PlayerSelector'
import Network from '../services/Network'
import { IPlayer } from '../../../types/IOfficeState'
import { PlayerBehavior } from '../../../types/PlayerBehavior'
import { ItemType } from '../../../types/Items'

import store from '../stores'
import { setFocused, setLocation, setShowChat } from '../stores/ChatStore'
import LogInfo from '../services/LogInfo'
import { logInfoSlice, setUserLocation } from '../stores/LogInfoStore'
import { phaserEvents } from '../events/EventCenter'
import { closeDoor, openDigital, openSquare, setDoorLocation } from '../stores/DoorStore'
import phaserGame from '../PhaserGame'
import Bootstrap from './Bootstrap'
import Door from '../items/Door'
import Computer from '../items/Computer'
import Whiteboard from '../items/Whiteboard'
import Chair from '../items/Chair'

export default class Conference extends Phaser.Scene {
  network!: Network
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keyE!: Phaser.Input.Keyboard.Key
  private keyR!: Phaser.Input.Keyboard.Key
  private map!: Phaser.Tilemaps.Tilemap
  myPlayer!: MyPlayer
  private playerSelector!: Phaser.GameObjects.Zone
  private otherPlayers!: Phaser.Physics.Arcade.Group
  private otherPlayerMap = new Map<string, OtherPlayer>()
  computerMap = new Map<string, Computer>()
  private whiteboardMap = new Map<string, Whiteboard>()
  logInfo!: LogInfo
  private location = 'conference'

  constructor() {
    super('conference')
  }

  registerKeys() {
    this.cursors = this.input.keyboard.createCursorKeys()
    // maybe we can have a dedicated method for adding keys if more keys are needed in the future
    this.keyE = this.input.keyboard.addKey('E')
    this.keyR = this.input.keyboard.addKey('R')
    this.input.keyboard.disableGlobalCapture()
    this.input.keyboard.on('keydown-ENTER', (event) => {
      store.dispatch(setShowChat(true))
      store.dispatch(setFocused(true))
    })
    this.input.keyboard.on('keydown-ESC', (event) => {
      store.dispatch(setShowChat(false))
    })
  }

  disableKeys() {
    this.input.keyboard.enabled = false
  }

  enableKeys() {
    this.input.keyboard.enabled = true
  }

  create(data: { network: Network , logInfo: LogInfo}) {
    console.log('create conference')
    if (!data.network) {
      throw new Error('server instance: network missing')
    } else {
      this.network = data.network
    }
    createCharacterAnims(this.anims)

    this.map = this.make.tilemap({ key: 'tileConfer' })
    const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')

    const groundLayer = this.map.createLayer('Ground', [FloorAndGround])
    groundLayer.setCollisionByProperty({ collides: true })


    // debugDraw(groundLayer, this)
    this.myPlayer = this.add.myPlayer(705, 500, 'adam', this.network.mySessionId)
    this.playerSelector = new PlayerSelector(this, 0, 0, 16, 16)

    const door = this.physics.add.staticGroup({ classType: Door })
    const doorLayer = this.map.getObjectLayer('Door')
    doorLayer.objects.forEach((obj, i) => {
      this.addObjectFromTiled(door, obj, 'roomDoor', 'Generic')
    })

     // import chair objects from Tiled map to Phaser
     const chairs = this.physics.add.staticGroup({ classType: Chair })
     const chairLayer = this.map.getObjectLayer('Chair')
     chairLayer.objects.forEach((chairObj) => {
       const item = this.addObjectFromTiled(chairs, chairObj, 'chairs', 'chair') as Chair
       // custom properties[0] is the object direction specified in Tiled
       item.itemDirection = chairObj.properties[0].value
     })
 
 

    // import other objects from Tiled map to Phaser
    this.addGroupFromTiled('Wall', 'tiles_wall', 'FloorAndGround', false)
    this.addGroupFromTiled('ObjectsOnCollide', 'generic', 'Generic', true)

    this.otherPlayers = this.physics.add.group({ classType: OtherPlayer })

    this.cameras.main.zoom = 1.5
    this.cameras.main.startFollow(this.myPlayer, true)

    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], groundLayer)

    this.physics.add.overlap(
      this.myPlayer,
      this.otherPlayers,
      this.handlePlayersOverlap,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.myPlayer,
      [door],
      this.handleDoorOverlap,
      undefined,
      this
    ) 
   // phaserEvents.removeAllListeners()
    // register network event listeners
    console.log('class: onPlayerJoined')
    //if (this.network.scene === 'square') {
      this.network.onPlayerJoined(this.handlePlayerJoined, this)
      this.network.onPlayerLeft(this.handlePlayerLeft, this)
      this.network.onMyPlayerReady(this.handleMyPlayerReady, this)
      this.network.onMyPlayerVideoConnected(this.handleMyVideoConnected, this)
      this.network.onPlayerUpdated(this.handlePlayerUpdated, this)
      this.network.onItemUserAdded(this.handleItemUserAdded, this)
      this.network.onItemUserRemoved(this.handleItemUserRemoved, this)
      this.network.onChatMessageAdded(this.handleChatMessageAdded, this)
   // }
  }
  private async handleDoorOverlap(playerSelector, selectionItem) {
    // const currentItem = playerSelector.selectedItem as Item
    // // currentItem is undefined if nothing was perviously selected
    // if (currentItem) {
    //   // if the selection has not changed, do nothing
    //   if (currentItem === selectionItem || currentItem.depth >= selectionItem.depth) {
    //     return
    //   }
    //   // if selection changes, clear pervious dialog
    //   if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING) currentItem.clearDialogBox()
    // }
    // // set selected item and set up new dialog
    // playerSelector.selectedItem = selectionItem
    // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

    // phaserEvents.shutdown()

    // this.network.joinOrCreatePublic()
    // .then(() => bootstrap.launchGame())
    //  .then(()=>{setTimeout(() => {
    //   store.dispatch(setDoorLocation('digital'))
    //   store.dispatch(setLocation('digital'))
    //   store.dispatch(setUserLocation('digital'))
    //   store.dispatch(openDigital())
    // }, 1000);})
    // .then(()=>{setTimeout(() => {
    //   store.dispatch(closeDoor())
    //    this.scene.stop()
    // }, 1000);})
    // .catch((error) => console.error(error))
    
    // // phaserEvents.removeAllListeners()
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5
    const actualY = object.y! - object.height! * 0.5
    const obj = group
      .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
      .setDepth(actualY)
    return obj
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    const group = this.physics.add.staticGroup()
    const objectLayer = this.map.getObjectLayer(objectLayerName)
    objectLayer.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5
      const actualY = object.y! - object.height! * 0.5
      group
        .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
        .setDepth(actualY)
    })
    if (this.myPlayer && collidable)
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], group)
  }

  // function to add new player to the otherPlayer group
  private handlePlayerJoined(newPlayer: IPlayer, id: string) {
    const otherPlayer = this.add.otherPlayer(newPlayer.x, newPlayer.y, 'adam', id, newPlayer.name)
    this.otherPlayers.add(otherPlayer)
    this.otherPlayerMap.set(id, otherPlayer)
  }

  // function to remove the player who left from the otherPlayer group
  private handlePlayerLeft(id: string) {
    if (this.otherPlayerMap.has(id)) {
      const otherPlayer = this.otherPlayerMap.get(id)
      if (!otherPlayer) return
      this.otherPlayers.remove(otherPlayer, true, true)
      this.otherPlayerMap.delete(id)
    }
  }

  private handleMyPlayerReady() {
    this.myPlayer.readyToConnect = true
  }

  private handleMyVideoConnected() {
    this.myPlayer.videoConnected = true
  }

  // function to update target position upon receiving player updates
  private handlePlayerUpdated(field: string, value: number | string, id: string) {
    const otherPlayer = this.otherPlayerMap.get(id)
    otherPlayer?.updateOtherPlayer(field, value)
  }

  private handlePlayersOverlap(myPlayer, otherPlayer) {
    otherPlayer.makeCall(myPlayer, this.network?.webRTC)
  }

  private handleItemUserAdded(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.COMPUTER) {
      const computer = this.computerMap.get(itemId)
      computer?.addCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.addCurrentUser(playerId)
    }
  }

  private handleItemUserRemoved(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.COMPUTER) {
      const computer = this.computerMap.get(itemId)
      computer?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.removeCurrentUser(playerId)
    }
  }

  private handleChatMessageAdded(playerId: string, content: string) {
    const otherPlayer = this.otherPlayerMap.get(playerId)
    otherPlayer?.updateDialogBubble(content)
  }

  update(t: number, dt: number) {
    if (this.myPlayer && this.network) {
      this.playerSelector.update(this.myPlayer, this.cursors)
      this.myPlayer.update(this.playerSelector, this.cursors, this.keyE, this.keyR, this.network)
    }
  }
}
