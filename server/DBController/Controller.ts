import { createConnection } from 'mysql'

export default class Controller{
    
    connection = createConnection({
        host : 'localhost',
        user : 'root',
        password : '1234',
        database : 'kumoh_together'
    })
    constructor(){
       
    }
}