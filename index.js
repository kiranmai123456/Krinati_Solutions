const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

mongoose.connect(process.env.db,{useNewUrlParser:true},console.log("DB Connected"))

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

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.post('/add-user',async (req,res)=>{
        const data = new users({
            id:req.body.id,
            name : req.body.name,
            hobbies : req.body.hobbies
        })
        try {
            await data.save()
            res.send("Data added successfully")
        }catch (error) {
            res.send(error)
    }   
})

app.get('/match/:id',async (req,res)=>{
    const data = await users.find()
    const new_data = await data.filter(element => element.id != req.params.id)
    const user = await data.filter(element => element.id == req.params.id)
    result=[]
    for(let i=0;i<user[0].hobbies.length;i++){
        new_data.forEach(element => {
            if(element.hobbies.includes(user[0].hobbies[i]) && !(result.includes(element))==true){
                result.push(element)  
            }
        });
    }

    res.send(result)
})

app.listen(3000,console.log("Listening on port 3000"))    