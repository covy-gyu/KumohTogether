import Peer from 'peerjs'
import store from '../stores'
import { setMyStream, addVideoStream, removeVideoStream, setUrl } from '../stores/ComputerStore'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
let blobs;
    let blob;
    let rec;let stream;
    let voiceStream;
    let desktopStream;
    let streamq;
export default class ShareScreenManager {
  private myPeer: Peer
  myStream?: MediaStream

  constructor(private userId: string) {
    const sanatizedId = this.makeId(userId)
    this.myPeer = new Peer(sanatizedId)
    this.myPeer.on('error', (err) => {
      console.log('ShareScreenWebRTC err.type', err.type)
      console.error('ShareScreenWebRTC', err)
    })

    this.myPeer.on('call', (call) => {
      call.answer()

      call.on('stream', (userVideoStream) => {
        store.dispatch(addVideoStream({ id: call.peer, call, stream: userVideoStream }))
      })
      // we handled on close on our own
    })
  }

  onOpen() {
    if (this.myPeer.disconnected) {
      this.myPeer.reconnect()
    }
  }

  onClose() {
    this.stopScreenShare(false)
    this.myPeer.disconnect()
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id
  // Also for screen sharing ID add a `-ss` at the end.
  private makeId(id: string) {
    return `${id.replace(/[^0-9a-z]/gi, 'G')}-ss`
  }
   mergeAudioStreams = (desktopStream, voiceStream) => {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      // If you don't want to share Audio from the desktop it should still work with just the voice.
      const source1 = context.createMediaStreamSource(desktopStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }
    
    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }
      
    return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
  };
  async startScreenShare() {
    voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        console.log("asa:"+voiceStream)
    navigator.mediaDevices
      ?.getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // Detect when user clicks "Stop sharing" outside of our UI.
        // https://stackoverflow.com/a/25179198
        
        const track = stream.getVideoTracks()[0]
        const tracks = [
          ...stream.getVideoTracks(), 
          ...this.mergeAudioStreams(stream, voiceStream)
        ];
        // if (track) {
        //   track.onended = () => {
        //     this.stopScreenShare()
        //   }
        // }
        streamq = new MediaStream(tracks);
        this.myStream = streamq
        store.dispatch(setMyStream(streamq))
        blobs = [];
        rec = new MediaRecorder(streamq, {mimeType: 'video/webm; codecs=vp8,opus'});
        rec.ondataavailable = (e) => blobs.push(e.data);
        rec.onstop = async () => {
          
          //blobs.push(MediaRecorder.requestData());
          blob = new Blob(blobs, {type: 'video/webm'});
          let url = window.URL.createObjectURL(blob);
          store.dispatch(setUrl(url));
        };
        // Call all existing users.
        const game = phaserGame.scene.keys.game as Game
        const computerItem = game.computerMap.get(store.getState().computer.computerId!)
        if (computerItem) {
          for (const userId of computerItem.currentUsers) {
            this.onUserJoined(userId)
          }
        }
      })
  }
  startRec() {
    rec.start();
  }
  endRec() {
    rec.stop();
  }
  // TODO(daxchen): Fix this trash hack, if we call store.dispatch here when calling
  // from onClose, it causes redux reducer cycle, this may be fixable by using thunk
  // or something.
  stopScreenShare(shouldDispatch = true) {
    this.myStream?.getTracks().forEach((track) => track.stop())
    this.myStream = undefined
    if (shouldDispatch) {
      store.dispatch(setMyStream(null))
      // Manually let all other existing users know screen sharing is stopped
      const game = phaserGame.scene.keys.game as Game
      game.network.onStopScreenShare(store.getState().computer.computerId!)
    }
  }

  onUserJoined(userId: string) {
    if (!this.myStream || userId === this.userId) return

    const sanatizedId = this.makeId(userId)
    this.myPeer.call(sanatizedId, this.myStream)
  }

  onUserLeft(userId: string) {
    if (userId === this.userId) return

    const sanatizedId = this.makeId(userId)
    store.dispatch(removeVideoStream(sanatizedId))
  }
}
