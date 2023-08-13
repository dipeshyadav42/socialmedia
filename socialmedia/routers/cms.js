const router=require('express').Router()
const regc=require('../controllers/regcontroller')
const multer=require('multer')
const reg = require('../models/reg')
 
function handlerole(req,res,next){
    if(req.session.role!=='free'){
    next()
}else{
    res.send("you Don't have subscription to see your contact details")
}
}

let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/profileimages')
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
})

let upload=multer({
    storage:storage,
    limits:{fileSize:4*1024*1024}
})

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}



router.get('/',regc.loginpage)
router.get('/reg',regc.regpage)
router.post('/reg',regc.register)
router.post('/',regc.login)
router.get('/userprofile', handlelogin,regc.userprofile)
router.get('/logout',regc.logout)
router.get('/forgot',regc.forgotpage)
router.post('/forgot',regc.forgotlinksend)
router.get('/changepassword/:email',regc.passwordresetform)
router.post('/changepassword/:email',regc.resetpasswordchange)
router.get('/profile',regc.profileupdatepage)
router.post('/profile',upload.single('img'),regc.profileupdate)
router.get('/usersingledetail/:id',handlerole,regc.usersingledata)
router.get('/resetpass',regc.resetpage)
router.post('/resetpass',regc.newpass)










module.exports=router