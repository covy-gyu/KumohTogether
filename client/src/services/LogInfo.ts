export default class LogInfo {
    private userId = ''
    private userName = ''
    private userAvatar = ''

    constructor(){

    }

    setUserId(id:string){
        this.userId = id
    }
    setUserName(name:string){
        this.userName = name
    }
    setUserAvatar(name:string){
        this.userAvatar = name
    }

    getUserId():string{
        return this.userId
    }
    getUserName():string{
        return this.userName
    }
    getUserAvatar():string{
        return this.userAvatar
    }
}