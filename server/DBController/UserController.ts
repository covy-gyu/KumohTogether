import { createConnection } from 'mysql';
import { IUser } from '../../types/Users'
import Controller from './Controller';

const connection = createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'kumoh_together'
})

export default class UserController implements IUser{

    ID: string
    password: string

  
  
    checkLoginInfo(user: IUser){
        connection.connect();
        connection.query('SELECT * from user', (error: any, rows: string) =>{
            if(error) throw error;
            var string = JSON.stringify(rows);
            var json = JSON.parse(string);
            
            for(let i =0; i<json.length;i++){
                json[i].user_id = this.ID
                json[i].user_password = this.password
            }
            console.log('hi')
            console.log(json[0].user_id);
            console.log(json[0].user_password);
        })
        connection.end();
    }
}


