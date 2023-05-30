const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},console.log("DB Connected"))

const schema = mongoose.Schema({
    id:{
        type:Number,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    hobbies:{
        type: Array,
        required : true
    }},
    {collection : "users"})

const users = new mongoose.model('users',schema)    


app.post('/add',async (req,res)=>{
    const data = new users({
        id : req.body.id,
        name : req.body.name,
        hobbies : req.body.hobbies
    })
    try {
        await data.save()
        res.send("Data added")
    }catch (error) {
        res.send(error)
    }   
})

app.get('/match/:id',async (req,res)=>{
    const data = await users.find()
    const other_data = await data.filter(element => element.id != req.params.id)
    const user = await data.filter(element => element.id == req.params.id)
    result=[]
    other_data.forEach(element => {
        if(user[0].hobbies.some(ele => element.hobbies.includes(ele))){
            result.push(element)
        }
    });
    
    res.send(result)
})

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(4000,console.log("Listening on port 4000"))    