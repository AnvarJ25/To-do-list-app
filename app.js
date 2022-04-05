var express = require('express')
var app = express()
var path = require("path")
var fs = require('fs')
const port = process.env.PORT || 3000

app.set("views", path.join(__dirname, "views") )
app.set("view engine", "pug")

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))
/// local host 3000
app.get('/', (req,res) => {
    res.render('index')
})

app.get('/create', (req,res) => {
    res.render('create')
})

app.post('/create', (req,res) => {
    let title = req.body.title
    let moredetails = req.body.moredetails

    if (title.trim() === '' ){
        res.render('create', {error: true })
    } else{
        fs.readFile('./data/task.json', (err, data) =>{
            if (err) throw err

            let task = JSON.parse(data)

            task.push({
                id: id(),
                title: title,
                moredetails: moredetails,

            })
            fs.writeFile('./data/task.json', JSON.stringify(task), err =>{
                if (err) throw err

                res.render('create')
            })
        })
    }
    
})


app.get('/list', (req, res) =>{

    fs.readFile('./data/task.json', (err, data) =>{
        if (err) throw err

        let tasks = JSON.parse(data)

        res.render('list', {tasks: tasks} )
    })
})

app.get('/list/:id', (req, res) => {
    let id = req.params.id

    fs.readFile('./data/task.json', (err, data) =>{
        if (err) throw err

        let tasks = JSON.parse(data)

        let task = tasks.filter(task => task.id == id)[0]

        res.render('details', {task: task})
    })
})



app.get('/:id/delete', (req, res) =>{
    let id = req.params.id

    fs.readFile('./data/task.json', (err, data) =>{
        if (err) throw err

        let tasks = JSON.parse(data)

        let task = tasks.filter(task => task.id != id)

        fs.writeFile('./data/task.json', JSON.stringify(task), (err) =>{
            if (err) throw err
            res.render('list', {tasks: task, deleted: true})
        })
    })
})




function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

app.listen(port)
