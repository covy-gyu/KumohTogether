import { createConnection } from 'mysql';

const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'kumoh_together'
})

export function getLectureVideoList(message: { userId: string }, callback: (lectureVideoList: any) => void) {

    var lectureVideoListArray: any[] = [];
    connection.connect;

    var id: string;

    var selectMemberIdQuery = 'SELECT * FROM kumoh_together.member where member_id = ?'
    var selectMemberLectureQuery = 'SELECT * from kumoh_together.member_lecture where member_id = ?';
    var selectProLectureQuery = 'SELECT * from kumoh_together.lecture where lecture_pro = ?';
    var selectLectureVideoQuery = 'SELECT * from kumoh_together.lecture_video where lecture_id = ?';
    connection.query(selectMemberIdQuery, [message.userId], (error1: any, rows1: any) => {
        if (error1) throw error1;
        var string = JSON.stringify(rows1);
        var json = JSON.parse(string);

        id = json[0].id;

        if (json[0].member_identification == '교수') {
            try {
                connection.query(selectProLectureQuery, [id], (error: any, rows: any) => {
                    if (error) throw error;
                    for (var key in rows) {
                        connection.query(selectLectureVideoQuery, [rows[key].id], (error2: any, rows2: any) => {
                            if (error2) throw error2;
                            lectureVideoListArray.push(rows2)
                        })
                    }
                })
            }
            finally {
                setTimeout(function () {
                    callback(lectureVideoListArray);
                }, 1000)
            }
        }
        else {
            try {
                connection.query(selectMemberLectureQuery, [id], (error: any, rows: any) => {
                    if (error) throw error;
                    for (var key in rows) {
                        connection.query(selectLectureVideoQuery, [rows[key].lecture_id], (error2: any, rows2: any) => {
                            if (error2) throw error2;
                            lectureVideoListArray.push(rows2)
                        })
                    }
                })
            }
            finally {
                setTimeout(function () {
                    callback(lectureVideoListArray);
                }, 1000)
            }
        }
    });
}

export function isPro(message: { userId: string }, callback: (result: boolean) => void) {
    connection.connect;
    var selectMemberIdQuery = 'SELECT * FROM kumoh_together.member where member_id = ?'
    connection.query(selectMemberIdQuery, [message.userId], (error: any, rows: any) => {
        if (error) throw error;
        var string = JSON.stringify(rows);
        var json = JSON.parse(string);

        if (json[0].member_identification == '교수') {
            callback(true);
        }
        else {
            callback(false);
        }
    })
}

export function uploadLectureVideo(message: { lecture_id: string, lecture_video: string, lecture_video_contents: string, lecture_video_title: string }, callback: (reslut: boolean) => void) {
    connection.connect;
    var insertVideoQuery = 'INSERT INTO `kumoh_together`.`lecture_video`(`lecture_video`,`lecture_video_contents`,`lecture_video_title`,`lecture_id`)VALUES(?,?,?,?);'
    connection.query(insertVideoQuery, ['testVideo2.mp4', message.lecture_video_contents, message.lecture_video_title, message.lecture_id], (error: any, rows: any) => {
        if (error) throw error;
        else {
            callback(true);
        }
    })
}

export function getLectureList(message: { userId: string }, callback: (lectureVideoList: any) => void) {
    connection.connect;
    var id: string;
    var selectMemberIdQuery = 'SELECT * FROM kumoh_together.member where member_id = ?'
    var selectProLectureQuery = 'SELECT * from kumoh_together.lecture where lecture_pro = ?';
    connection.query(selectMemberIdQuery, [message.userId], (error1: any, rows1: any) => {
        if (error1) throw error1;
        var string = JSON.stringify(rows1);
        var json = JSON.parse(string);
        id = json[0].id;
        connection.query(selectProLectureQuery, [id], (error: any, rows: any) => {
            if (error) throw error;
            setTimeout(function () {
                callback(rows);
            }, 1000)
        })

    });
}

export function deleteLectureVideo(message: { lecture_id: string }, callback: (result: boolean) => void) {
    connection.connect;
    var deleteLectureVideoQuery = 'DELETE from kumoh_together.lecture_video where id = ?';
    connection.query(deleteLectureVideoQuery, [message.lecture_id], (error1: any, rows1: any) => {
        if (error1) throw error1;
        setTimeout(function () {
            callback(true);
        }, 1000)
    });
}

export function updateLectureVideo(message: { id: string, lecture_video: string, lecture_video_contents: string, lecture_video_title: string }, callback: (reslut: boolean) => void) {
    connection.connect;
    var insertVideoQuery = 'UPDATE `kumoh_together`.`lecture_video` SET `lecture_video` = ?, `lecture_video_contents`= ?, `lecture_video_title` = ? WHERE `id` = ?;'
    connection.query(insertVideoQuery, ['testVideo1.mp4', message.lecture_video_contents, message.lecture_video_title, message.id], (error: any, rows: any) => {
        if (error) throw error;
        else {
            callback(true);
        }
    })
}

export function getOneLectureVideo(message: {id: string}, callback: (lectureVideo: any) => void) {
    connection.connect;
    var getOneLectureVideoQuery = 'SELECT * from kumoh_together.lecture_video where lecture_id = ?';
    connection.query(getOneLectureVideoQuery, [message.id], (error: any, rows: any) =>{
        if (error) throw error;
        else {
            callback(rows);
        }
    })
}

export function getLectureTitle(messagge: {lectureId: string}, callback: (lecture: any) => void) {
    connection.connect;
    var getLectureTitleQuery = 'SELECT * from kumoh_together.lecture where id = ?';
    connection.query(getLectureTitleQuery, [messagge.lectureId], (error: any, rows: any)=>{
        if (error) throw error;
        else {
            var string = JSON.stringify(rows);
            var json = JSON.parse(string);
            callback(json[0].lecture_name);
        }
    })
}