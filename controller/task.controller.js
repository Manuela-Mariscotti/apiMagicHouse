
const db = require('../database');

function getTasks(req,res){
    console.log("Lanzada getTasks()");
    console.log(req.body);

    let sql = "SELECT * FROM `magic-house`.tasks";

    db.connect((error)=>{
        if (error) {
            let response = {
            error : true,
            code : 400,
            message : 'DB Connection error --> '+error.message
        }
        res.send(response);
        }else {
            db.query(sql,(error,result)=>{
                if (error){
                    let response = {
                        error: true,
                        code: 400,
                        message : 'Error executing DB query -->'+error.message
                    }
                    res.send(response)
                } else {
                    let data = [];

                    result.forEach( (item) => {
                        data.push({
                            id_task : item.id_task,
                            taskname : item.taskname
                        })
                    })
                    console.log(data);

                    let response = {
                        error : false,
                        code : 200,
                        data: data
                    }
                    res.send(response)
                }
            })
        }
    })
}

function getTaskByHome(req,res){
    console.log("Lanzada getTaskByHome()");

    console.log(req.query);

    let sql = `SELECT 
    taskname,
    username,
    day as taskday,
    users_tasks.id_task,
    done
    FROM tasks JOIN users_tasks on (tasks.id_task = users_tasks.id_task)
    JOIN users on (users_tasks.id_user = users.id_user)
    WHERE id_hogar=${req.query.id_hogar} `

    db.connect((error)=>{
        if (error) {
            let response = {
                error : true,
                code : 400,
                message :  'DB Connection error --> '+error.message
            }
            res.send(response);
        }else {
            db.query(sql,(error,result) =>{
                if (error) {
                    let response = {
                        error : true,
                        code : 400,
                        message : 'Error executing DB query -->'+error.message
                    };

                    res.send(response);                    
                    
                }else {

                    let tareas = []

                    result.forEach( (item) => {
                        let tarea = tareas.find(element => element.taskname == item.taskname)

                        let asignacion = {
                            taskday : item.taskday,
                            username: item.username,
                            isDone: !!item.done
                        }

                        let tmp = []
                        for(let i = 0; i < 7; i++){
                            tmp.push({
                                username: 'unasigned'
                            })
                        }


                        if (tarea == undefined) {

                            tarea = {
                                id_task: item.id_task,
                                taskname: item.taskname, 
                                asignacion: tmp
                            }
                            tareas.push(tarea)
                        }

                        let weekday;

                        switch(item.taskday){
                            case 'L': 
                                weekday = 0
                                break;
                            case 'M':
                                weekday = 1;
                                break;
                            case 'X': 
                                weekday = 2
                                break;
                            case 'J':
                                weekday = 3;
                                break;
                            case 'V': 
                                weekday = 4
                                break;
                            case 'S':
                                weekday = 5;
                                break;
                            case 'D':
                                weekday = 6;
                                break;
                            default:
                                weekday = -1;
                                break
                        }
                        
                        // tarea.asignacion.push(asignacion)
                        tarea.asignacion.splice(weekday,1,asignacion);

                    })

                    console.log(tareas);
                    
                    let response = {
                        error : false,
                        code : 200,
                        data: tareas
                    }
                    res.send(response)
                }
            })
        }
    })


}

function postNewTask(req,res){
    console.log("Lanzada postNewTask()");
    console.log(req.body);

    let sql = "INSERT INTO `magic-house`.users_tasks SET id_user='"+req.body.id_user+"', id_task='"+req.body.id_task+"', day='"+req.body.day+"' ";

    db.connect((error)=>{
        if (error) {
            let response = {
            error : true,
            code : 400,
            message : 'DB Connection error --> '+error.message
        }
        res.send(response);
        }else {
            db.query(sql,function(error,result){
                if (error) {
                    let response = {
                        error : true,
                        code : 400,
                        message : 'Error executing DB query -->'+error.message
                    };

                    res.send(response);
                    
                }else{
                    if(result.insertId){
                        const response = {
                            error: false,
                            code: 200,
                            data: String(result.insertId)
                        }
                        console.log("Insert realizado.");
                        res.send(response);
                    }else{
                        let response = {
                            error : true,
                            code : 400,
                            message : 'Error creating new task in DB -->'+error.message
                        };

                        res.send(response)
                    }
                }
            })
        }
    })
}


function doTask(req, res){

    console.log(req.body);

    const id_task = req.body.id_task;
    const day = req.body.day;
    const id_hogar = req.body.id_hogar;

    let sql = 
        `UPDATE users_tasks 
        JOIN users ON (users_tasks.id_user = users.id_user)
        SET done = 1 
        WHERE(id_task = ${id_task} && day = '${day}' && id_hogar = ${id_hogar})`;

    console.log(sql)

    db.query(sql, (error, result) => {

        if(error){
            console.error('ERROR MARKING TASK AS DONE');
            console.error(error);

            const response = {
                error: true,
                code: 400,
                message: error.message
            };
            res.send(response);

        } else {

            const response = {
                error: false,
                code: 200,
                data: result
            };
            res.send(response);

        }
    })

}


module.exports = {getTasks, getTaskByHome, postNewTask, doTask}
