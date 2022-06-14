import { ServerError } from 'colyseus';
import { createConnection } from 'mysql';
import mysql from 'mysql';
const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'kumoh_together',
    dateStrings: 'date'
})



export  function getPos(message:{}, callback: (json:any)=>void) {
 
    
    var json
    connection.connect;
    connection.query('SELECT member.member_id,posts.id,posts.post_title,posts.post_contents,posts.post_isNoti,posts.post_create_date,posts.post_modify_date FROM kumoh_together.member,kumoh_together.posts where member.id = posts.user_id;', (error: any, rows: string) => {
        if (error) throw error;

        
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        callback(json);
        
    })
    
    

}
export  function getComment(message:{post_id:number}, callback: (json:any)=>void) {
 
    
    var json
    connection.connect;
    connection.query('SELECT member.member_id,comments.id,comments.comment_contents,comments.comment_create_date,comments.comment_modify_date FROM kumoh_together.member,kumoh_together.comments where member.id = comments.user_id and comments.post_id='+mysql.escape(message.post_id)+';', (error: any, rows: string) => {
        if (error) throw error;

        
        
        var string = JSON.stringify(rows);
        json = JSON.parse(string);
        console.log(json)
        callback(json);
        
    })
    

}
export  function registerPost(message:{DmemberId: number, Dtitle: string, Dcontent: string,DisNoti:number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('INSERT INTO `kumoh_together`.`posts`(`user_id`,`post_title`,`post_contents`,`post_isNoti`,`post_create_date`,`post_modify_date`)VALUES(' + mysql.escape(message.DmemberId)+',' + mysql.escape(message.Dtitle)+','+ mysql.escape(message.Dcontent)+','+ mysql.escape(message.DisNoti)+',now(),now());', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}
export  function registerComment(message:{user_id: number, content: string, post_id: number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('INSERT INTO `kumoh_together`.`comments`(`post_id`,`comment_contents`,`comment_create_date`,`comment_modify_date`,`user_id`)VALUES (' + mysql.escape(message.post_id)+',' + mysql.escape(message.content)+',now(),now(),'+ mysql.escape(message.user_id)+');', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    
}

export  function deletePost(message:{postIdd: number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('DELETE FROM kumoh_together.posts WHERE posts.id=' + mysql.escape(message.postIdd)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}
export  function modifyPostdb(message:{title:string,content:string, id: number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('UPDATE `kumoh_together`.`posts` SET `post_title` =' + mysql.escape(message.title)+' , `post_contents` ='+mysql.escape(message.content)+',`post_modify_date` = now() WHERE `id` = '+mysql.escape(message.id)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}
export  function modifyCommentdb(message:{id: number,content:string}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('UPDATE `kumoh_together`.`comments` SET `comment_contents` = ' + mysql.escape(message.content)+' , `comment_modify_date` = now() WHERE `id` = '+mysql.escape(message.id)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}
export  function DisplayPost(message:{postIdd: number}, callback: (json:any)=>void) {
 
    console.log(message);
    console.log("controller")
    var json
    connection.connect;
    connection.query('SELECT member.member_id,posts.id,posts.post_title,posts.post_contents,posts.post_isNoti,posts.post_create_date,posts.post_modify_date FROM kumoh_together.member,kumoh_together.posts where member.id = posts.user_id and posts.id=' + mysql.escape(message.postIdd)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            var string = JSON.stringify(rows);
            json = JSON.parse(string);
            console.log(json)
            callback(json);
        }
        

    })
    

}
export  function DisplayComment(message:{commentId: number}, callback: (json:any)=>void) {
 
    console.log(message);
    console.log("controller")
    var json
    connection.connect;
    connection.query('SELECT comments.comment_contents FROM kumoh_together.comments where comments.id=' + mysql.escape(message.commentId)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            var string = JSON.stringify(rows);
            json = JSON.parse(string);
            console.log(json)
            callback(json);
        }
        

    })
    

}

export  function deleteComment(message:{commentId: number}, callback: (result:boolean)=>void) {
 
    console.log(message);
    
    var json
    connection.connect;
    connection.query('DELETE FROM `kumoh_together`.`comments`WHERE id=' + mysql.escape(message.commentId)+';', (error: any, rows: string) => {
        if (error) throw error;
        else{
            callback(true);
        }
        

    })
    

}