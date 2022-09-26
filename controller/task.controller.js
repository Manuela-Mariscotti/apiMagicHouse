
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

    // let sql = `SELECT taskname, username, users.id_hogar,day FROM tasks JOIN users_tasks ON (tasks.id_task = users_tasks.id_task) JOIN users on (users_tasks.id_user = users.id_user)
    // WHERE id_hogar=${req.query.id_hogar} order by taskname` 

    // let sql = `SELECT 
    // taskname,
    // username,
    // users.id_hogar,
    // day as taskday
    // FROM tasks JOIN users_tasks on (tasks.id_task = users_tasks.id_task)
    // JOIN users on (users_tasks.id_user = users.id_user)
    // WHERE id_hogar=${req.query.id_hogar} GROUP by day `

    // let sql = `SELECT 
    // taskname,
    // username,
    // users.id_hogar,
    // day as taskday
    // FROM tasks JOIN users_tasks on (tasks.id_task = users_tasks.id_task)
    // JOIN users on (users_tasks.id_user = users.id_user)
    // WHERE id_hogar=${req.query.id_hogar} order by day 
    //  `

    let sql = `SELECT 
    taskname,
    users_tasks.id_task,
    username,
    users.id_hogar,
    day as taskday
    FROM tasks JOIN users_tasks on (tasks.id_task = users_tasks.id_task)
    JOIN users on (users_tasks.id_user = users.id_user)
    WHERE id_hogar=${req.query.id_hogar} order by users_tasks.id_task `

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

                    let data = [];
                    result.forEach( (item) => {
                        data.push({
                            taskname : item.taskname,
                            username : item.username,
                            id_hogar : item.id_hogar,
                            taskday : item.taskday
                        }) 
                    })

                    console.log(result);
                    
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



module.exports = {getTasks, getTaskByHome, postNewTask}