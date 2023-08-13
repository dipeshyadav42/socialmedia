const Reg=require('../models/reg')
const nodemailer=require('nodemailer')
const multer=require('multer')



exports.loginpage=(req,res)=>{
    res.render('login.ejs',{message:''})
}
exports.regpage=(req,res)=>{
    res.render('reg.ejs',{message:''})
}


exports.register=async(req,res)=>{
    const{us,pass}=req.body
    const emailcheck=await Reg.findOne({email:us})
    try{
        if(emailcheck==null){
    const record=new Reg({email:us,password:pass})
    record.save()
    res.render('reg.ejs',{message:'successfully created'})
        }else{
            res.render('reg.ejs',{message:'Email is already registered'})
        }
     }catch(error){
       res.render('reg.ejs',{message:error.message})
     }
}




exports.login=async(req,res)=>{
    const{email,pass}=req.body
    const emailcheck=await Reg.findOne({email:email})
    if(emailcheck!==null){
        if(emailcheck.password==pass){
            if(emailcheck.status=='suspended' & emailcheck.email!=='admin@gmail.com'){
                res.render('login.ejs',{message:'Your account is suspended please cordinate with admin⚠️'})   
            }else{
            req.session.isAuth=true
            req.session.username=email
            req.session.role=emailcheck.role
            if(emailcheck.email=='admin@gmail.com'){
                res.redirect('/admin/dashboard')
            }else{
                res.redirect('/userprofile')
            }
        }
        }else{
            res.render('login.ejs',{message:'wrong credentails⚠️'})   
        }
    }else{
        res.render('login.ejs',{message:'wrong credentails⚠️'})
    }
}


exports.userprofile=async(req,res)=>{
    const loginname=req.session.username
    //let test=['defaultimg.webp']
    const record=await Reg.find({img:{$nin:['defaultimg.webp']}})
    res.render('usersprofile.ejs',{loginname,record})
}

exports.logout=(req,res)=>{
    req.session.destroy()
    res.redirect('/')
}

exports.forgotpage=(req,res)=>{
    res.render('forgotform.ejs',{message:''})
}

exports.forgotlinksend=async(req,res)=>{
    const {email}=req.body
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'grasscoaching@gmail.com', // generated ethereal user
        pass: 'mttsxrvxixazlxpq', // generated ethereal password
      },
    });
    console.log('connected to smtp')
    let info = await transporter.sendMail({
        from: 'grasscoaching@gmail.com', // sender address
        to:email , // list of receivers
        subject: 'password reset Link:9AM CMS', // Subject line
        text: 'Please click below link to RESET the password', // plain text body
        html: `<a href=http://localhost:5000/changepassword/${email}>Click here to reset</a>`, // html body
      });
      console.log("email sent")
      res.render('forgotform.ejs',{message:'Link has been sent to your email'})
}

exports.passwordresetform=(req,res)=>{
    res.render('resetform.ejs',{message:''})
}
exports.resetpasswordchange=async(req,res)=>{
    const{password}=req.body
    const email=req.params.email
    const record=await Reg.findOne({email:email})
    const id=record.id
    await Reg.findByIdAndUpdate(id,{password:password})
    res.render('passwordchangemessage.ejs',{message:'Successfully Password changed please try with new password'})
}

exports.admindashboard=(req,res)=>{    
    const username=req.session.username
    res.render('admin/dashboard.ejs',{username})
}

exports.adminusers=async(req,res)=>{
    const username=req.session.username
    const record=await Reg.find()
    res.render('admin/users.ejs',{username,record,message:''})
}

exports.usersstatusupdate=async(req,res)=>{
    const id=req.params.id
    const record1=await Reg.findById(id)
    let currentstatus=null
    if(record1.status=='suspended'){
        currentstatus='active'
    }else{
        currentstatus='suspended'
    }
    await Reg.findByIdAndUpdate(id,{status:currentstatus})
    const username=req.session.username
    const record=await Reg.find()
    res.render('admin/users.ejs',{username,record,message:'Successfully Updated'})
}

exports.profileupdatepage=async(req,res)=>{
    const loginname=req.session.username
    const record=await Reg.findOne({email:loginname})
    res.render('profileupdateform.ejs',{loginname,record,message:''})
}
exports.profileupdate=async(req,res)=>{
    const {fname,lname,mobile,about}=req.body
    const loginname=req.session.username
    const user=await Reg.findOne({email:loginname})
    const id=user.id
    if(req.file){
        const filename=req.file.filename
        await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,img:filename,desc:about})
    }else{
        await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,desc:about})
    }
    const record=await Reg.findOne({email:loginname})
    res.render('profileupdateform.ejs',{loginname,record,message:'Successfully profile has been updated'})
}

exports.usersdelete=async(req,res)=>{
    const id=req.params.id
    await Reg.findByIdAndDelete(id)
    const username=req.session.username
    const record=await Reg.find()
    res.render('admin/users.ejs',{username,record,message:'Successfully Deleted '})
}
exports.usersingledata=async(req,res)=>{
    const loginname=req.session.username
    const id=req.params.id
    const record=await Reg.findById(id)
    res.render('singleprofile.ejs',{loginname,record})
}

exports.roleupdate=async(req,res)=>{
    const id=req.params.id
    const record1=await Reg.findById(id)
    let newrole=null
    if(record1.role=='free'){
        newrole='suscribed'
    }else{
        newrole='free'
    }
    await Reg.findByIdAndUpdate(id,{role:newrole})
    const username=req.session.username
    const record=await Reg.find()
    res.render('admin/users.ejs',{record,username,message:'Role has been updated successfully'})
}

exports.resetpage=(req,res)=>{
    const loginname=req.session.username
    res.render('resetpassform.ejs',{loginname,message:''})
}

exports.newpass=async(req,res)=>{
    const {cpass,npass}=req.body
    const loginname=req.session.username
    const record=await Reg.findOne({email:loginname})
    console.log(record)
    const id=record.id
    let newpassword=null
    if(record.password==cpass){
        newpassword=npass
    }else{
        res.render('resetpassform.ejs',{loginname,message:'Old password is incorrect'})
    }
    await Reg.findByIdAndUpdate(id,{password:newpassword})
    res.render('resetpassform.ejs',{loginname,message:'password updated'})

}




