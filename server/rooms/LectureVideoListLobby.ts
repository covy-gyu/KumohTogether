import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { LectureVideoListLobbyState } from './schema/LectureVideoListLobbyState'
import { ILectureVideo } from '../../types/LectureVideo'
import { getLectureVideoList, isPro, uploadLectureVideo, getLectureList, deleteLectureVideo, updateLectureVideo, getOneLectureVideo, getLectureTitle } from '../DBController/LectureVideoListController'


export class LectureVideoListLobby extends Room<LectureVideoListLobbyState> {
    private dispatcher = new Dispatcher(this)


    async onCreate(options: ILectureVideo) {

        let hasPassword = false

        this.setState(new LectureVideoListLobbyState())
        this.onMessage(Message.SEND_LECTURE_VIDEO_LIST_REQUEST, (client, message: {id: string}) => {
            const { id } = message
            getLectureVideoList({userId: id}, (result) => {
                client.send(Message.SEND_LECTURE_VIDEO_LIST_RESPONSE, result);
            })

        })
        this.onMessage(Message.SEND_ISPRO_REQUEST, (client, message: {id: string}) =>{
            const { id } = message
            isPro({userId: id}, (result) =>{
                client.send(Message.SEND_ISPRO_RESPONSE, result);
            })
        })
        this.onMessage(Message.SEND_REGI_LECTURE_VIDEO_REQUEST, (client, message: {lecture_id: string, lecture_video: string, lecture_video_contents: string, lecture_video_title: string})=>{
            const {lecture_id, lecture_video, lecture_video_contents, lecture_video_title} = message
            uploadLectureVideo({lecture_id:lecture_id, lecture_video:lecture_video, lecture_video_contents: lecture_video_contents, lecture_video_title: lecture_video_title}, (result)=>{
                client.send(Message.SEND_REGI_LECTURE_VIDEO_RESPONSE, result);
            })
        })
        this.onMessage(Message.SEND_LECTURE_LIST_REQUEST, (client, message: {id: string}) => {
            const { id } = message
            getLectureList({userId: id}, (result) => {
                client.send(Message.SEND_LECTURE_LIST_RESPONSE, result);
            })
        })
        this.onMessage(Message.SEND_DELETE_VIDEO_REQUEST, (client, message: {lecture_id: string}) =>{
            const {lecture_id} = message
            deleteLectureVideo({lecture_id: lecture_id}, (result)=>{
                client.send(Message.SEND_DELETE_VIDEO_RESPONSE, result)
            })
        })
        this.onMessage(Message.SEND_UPDATE_VIDEO_REQUEST, (client, message: {id: string, lecture_video: string, lecture_video_contents: string, lecture_video_title: string})=>{
            const {id, lecture_video, lecture_video_contents, lecture_video_title} = message
            updateLectureVideo({id: id, lecture_video:lecture_video, lecture_video_contents: lecture_video_contents, lecture_video_title: lecture_video_title}, (result)=>{
                client.send(Message.SEND_UPDATE_VIDEO_RESPONSE, result);
            })
        })
        this.onMessage(Message.SEND_ONE_LECTURE_VIDEO_REQUEST, (client, message: {id: string}) =>{
            const { id } = message
            getOneLectureVideo({id: id}, (result)=>{
                client.send(Message.SEND_ONE_LECTURE_VIDEO_RESPONSE, result);
            })
        })
        this.onMessage(Message.SEND_LECTURE_TITLE_REQUEST, (client, message: {lectureId: string})=>{
            const { lectureId } = message
            getLectureTitle({lectureId: lectureId}, (result)=>{
                client.send(Message.SEND_LECTURE_TITLE_RESPONSE, result);
            })
        })
    }



    async onAuth(client: Client, options: {
    }) {
        return true
    }

    onJoin(client: Client, options: any) {


    }

    onLeave(client: Client, consented: boolean) {

    }

    onDispose() {

    }
}