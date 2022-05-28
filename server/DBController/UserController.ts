import { ServerError } from 'colyseus';
import { createConnection } from 'mysql';
import { IUser } from '../../types/Users'

const connection = createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'kumoh_together'
})

let id: string 
let password: string
let result: boolean
let msg: string 
let code: number

export default function login(user: IUser) {
    id = user.id
    password = user.password
    result = user.result
    msg = user.msg
    code = user.code
    var json
    const conn = connection.connect();
    connection.query('SELECT * from user where user_id = ' + id, (error: any, rows: string) => {
        if (error) throw error;
        var string = JSON.stringify(rows);
        json = JSON.parse(string);

        if (json[0]) {
            //조회된 행이 있을때(id 존재)
            if(json.user_password === password){
                
                result = true
                console.log("로그인 성공")
            }
            else{
                
                throw new ServerError(403, '비밀번호가 틀렸습니다!')
            }

        }
        else {
            throw new ServerError(403, '아이디가 존재하지 않습니다!')

        }

        console.log(json[0].user_id);
        console.log(json[0].user_password);
    })
    connection.end();
    return result
}



