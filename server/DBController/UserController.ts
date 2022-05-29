import { ServerError } from 'colyseus';
import { createConnection } from 'mysql';
import mysql from 'mysql';
import { IUser } from '../../types/Users';

const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'kumoh_together'
})


export default function login(message:{id:string,password:string}, callback: (user:IUser)=>void) {
 
    const user = {
        id: message.id,
        password : message.password,
        result : false,
        msg : '',
        code: 0,
    }
    var selectQuery = 'SELECT * from kumoh_together.member where member_id = ?'
    var json
    connection.connect;
    connection.query(selectQuery,[user.id], (error: any, rows: string) => {
        if (error) throw error;
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        if (json[0]) {
            //조회된 행이 있을때(id 존재)
            if (json[0].member_password === user.password) {

                user.result = true
                console.log("로그인 성공")
            }
            else {

                console.log('비밀번호가 틀렸습니다!')
            }

        }
        else {
            console.log('아이디가 존재하지 않습니다!')

        }

        // console.log(json[0].member_id);
        // console.log(json[0].member_password);
        callback(user)

    })
    // await connection.end();

}



