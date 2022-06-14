import { ServerError } from 'colyseus';
import { createConnection } from 'mysql';
import mysql from 'mysql';
import { IUser } from '../../types/Users';
import { IMember } from '../../types/Members';
const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'kumoh_together'
})


export function login(message:{id:string,password:string}, callback: (identi:string,user:IUser)=>void) {
 
    const user = {
        id: message.id,
        password : message.password,
        result : false,
        msg : '',
        code: 0,
    }

    var json
    connection.connect;
    connection.query('SELECT * from kumoh_together.member where member_id = ' + mysql.escape(user.id) + ';', (error: any, rows: string) => {
        if (error) throw error;

        
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log(json[0])
        console.log(user.password)
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
        user.result = true
        callback(json[0].member_identification,user)

    })
    // await connection.end();

}

export  function register(message:{id:string,password:string,identification:string,name:string,nickname:string,socialNum:string,department:number}, callback: (result:boolean)=>void) {
 
    const member = {
        id: message.id,
        password : message.password,
        identification:message.identification,
        name:message.name,
        nickname:message.nickname,
        socialNum:message.socialNum,
        department:message.department,
        result : false,
    }
    var json
    connection.connect;
    connection.query('INSERT INTO member(member_id,member_identification,member_name,member_nick,member_password,member_social_num,department_id) VALUES(' + mysql.escape(member.id)+',' + mysql.escape(member.identification)+','+ mysql.escape(member.name)+','+ mysql.escape(member.nickname)+','+ mysql.escape(member.password)+','+ mysql.escape(member.socialNum)+','+ mysql.escape(member.department)+');', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true)
        }
        

    //     // console.log(json[0].member_id);
    //     // console.log(json[0].member_password);
         

     })
    // await connection.end();

}
export  function getUserId(message:{id:number}, callback: (userId:string)=>void) {
 
    
    var json
    connection.connect;
    connection.query('SELECT member_id from kumoh_together.member where id='+mysql.escape(message.id)+';', (error: any, rows: string) => {
        if (error) throw error;

        
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log("getPos")
        callback(json[0].member_id);
        
    })
    

}
export  function getId(message:{userIda:string}, callback: (id:number)=>void) {
 
    
    var json
    connection.connect;
    connection.query('SELECT member.id FROM kumoh_together.member where member.member_id='+mysql.escape(message.userIda)+';', (error: any, rows: string) => {
        if (error) throw error;

        
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log("getPos")
        console.log(json[0].id)
        callback(json[0].id);
        
    })
    

}
export  function getUse(message:{in:string}, callback: (json:any)=>void) {
 
    var json;
    connection.connect;
    connection.query('SELECT member.id,member.member_id,member.member_identification,member.member_name,member.member_nick,departments.department_name FROM kumoh_together.member,kumoh_together.departments where member.department_id=departments.id and member.member_identification!='+mysql.escape(message.in)+';', (error: any, rows: string) => {
        if (error) throw error;
                var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log(json)
        callback(json);
        
    })
    
    

}
export  function getDepart(message:{}, callback: (json:any)=>void) {
 
    var json;
    connection.connect;
    connection.query('SELECT * FROM kumoh_together.departments;', (error: any, rows: string) => {
        if (error) throw error;
                var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log(json)
        callback(json);
        
    })
    
    

}
export  function deleteUser(message:{id:number}, callback: (json:any)=>void) {
 
    var json;
    connection.connect;
    connection.query('DELETE FROM `kumoh_together`.`member`WHERE id='+mysql.escape(message.id)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
    })
    
    

}


export  function displayOneUser(message:{in:number}, callback: (json:any)=>void) {
    console.log("displayOneUser")
    var json;
    connection.connect;
    connection.query('SELECT member.id,member.member_id,member.member_identification,member.member_name,member.member_nick,departments.department_name FROM kumoh_together.member,kumoh_together.departments where member.department_id=departments.id and member.id='+mysql.escape(message.in)+';', (error: any, rows: string) => {
        if (error) throw error;
                var string = JSON.stringify(rows);
        json = JSON.parse(string);
        callback(json);
        
    })
    
    
    
    
}
export  function displayDepartId(message:{in:string}, callback: (json:any)=>void) {
    console.log("displayOneUser")
    var json;
    connection.connect;
    connection.query('SELECT departments.id FROM kumoh_together.departments where department_name='+mysql.escape(message.in)+';', (error: any, rows: string) => {
        if (error) throw error;
                var string = JSON.stringify(rows);
        json = JSON.parse(string);
        callback(json[0].id);
        
    })
    
}

export  function modifyuser(message:{id:number, member_id:string, member_identification:string, member_name:string, member_nick:string,dapartment_id:number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('UPDATE `kumoh_together`.`member` SET `member_identification` = '+mysql.escape(message.member_identification)+', `member_name` = '+mysql.escape(message.member_name)+', `member_nick` = '+mysql.escape(message.member_nick)+', `department_id` = '+mysql.escape(message.dapartment_id)+' WHERE `id` = '+mysql.escape(message.id)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}