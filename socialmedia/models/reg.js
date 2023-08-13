const mongoose=require('mongoose')


   const regSchema=mongoose.Schema({
        email:String,
        password:String,
        firstname:String,
        lastname:String,
        mobile:Number,
        desc:String,
        role:{type:String,default:'free'},
        img:{type:String,default:'defaultimg.webp'},
        creationDate:{type:String,default:new Date()},
        status:{type:String,default:'suspended'}
    })



module.exports=mongoose.model('reg',regSchema)