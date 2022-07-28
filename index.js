const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Userschema = require('./models/users')
const Commentschema = require('./models/comments')

mongoose.connect('mongodb+srv://harshendra:harshendra@cluster0.zpct5.mongodb.net/mernstack?retryWrites=true&w=majority');

const database = mongoose.connection

app.use(express.json());

app.use(cors());

const PORT = 8000

const comparepassword = async (pass,encryptedpass) => {
    const hashedpass = await bcrypt.compare(pass,encryptedpass);
    return hashedpass
}

app.post('/login',async (req,res)=>{
    const data = await Userschema.findOne({
        email: req.body.email,
    })
    const hashedpass = await bcrypt.compare(req.body.password,data.password);
    if(hashedpass){
        if (data){
            const token = jwt.sign({email:req.body.email}, 'secretharshendra')
            return res.status(200).send({sucess:true,token:token})
        }
        else{
        return res.status(400).send({sucess:false})
    }
    }
    else{
        return res.status(400).send({sucess:false})
    }
    
})

app.post('/createid',async (req,res)=>{
    const newpass =  await bcrypt.hash(req.body.password,10);
    const data = new Userschema({
        email: req.body.email,
        password: newpass
    })
    const savedata = await data.save()
    if (savedata){
        return res.status(200).send({sucess:true})
    }
    else{
    return res.status(200).send({sucess:false})
}
})


app.post('/comment',async (req,res)=>{
    const token = req.headers['x-access-token'];
    const decode = jwt.verify(token,'secretharshendra');
    const data = new Commentschema({
        email: req.body.email,
        senderemail: decode.email,
        comment: req.body.comment
    })
    try {
        const saveddata = await data.save()
        return res.status(200).send({sucess:true,body:saveddata})
    }
    catch (error) {
        res.status(400).json({sucess:false,message: error.message})
    }
})
app.listen(PORT, ()=>console.log('listining to port'))