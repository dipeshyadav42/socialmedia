const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
const adminRouter=require('./routers/admin')
const cmsRouter=require('./routers/cms')
const mongoose=require('mongoose')
const session=require('express-session')
mongoose.connect('mongodb://127.0.0.1:27017/GRASSPROJECTBYRAVISIR2')



app.use(session({
    secret:'dipesh',
    resave:false,
    saveUninitialized:false
}))
app.use(cmsRouter)
app.use('/admin',adminRouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(5000)