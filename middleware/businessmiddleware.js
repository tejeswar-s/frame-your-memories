//jwt to create a session
const jwt=require('jsonwebtoken');

//importing the db to get databse object
const db = require('../db');

//objectId() to convert string into ObectId
const {ObjectId}=require('mongodb');

//Protecting the business pages
//Verifies if user is allowed to access restricted pages or not

const requireBusinessAuth=async (req,res,next)=>{
    const token=req.cookies.jwt;
    
    if(token){
        jwt.verify(token,'a secret message',async (error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.redirect('/businesssignuplogin');
            }else{
                const dbobj=db.getDb();// console.log(decodedtoken.id);
                await dbobj.collection('business').findOne({_id:new ObjectId(decodedtoken.id)})
                .then(result=>{
                    if(result){
                         if(result.isverified==true){
                            next();
                        }else{
                            res.redirect('/verification');
                        }
                    }else{
                        console.log('NOt found');
                        res.redirect('/businesssignuplogin');
                    }
                })
                .catch(()=>{
                    res.redirect('/businesssignuplogin');
                })
            }

        })
            
        
    }else{
        res.redirect('/businesssignuplogin');
    }
}

//checks the user and pass the username to the next middleware

const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'a secret message',(error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.locals.user='';
                next();
            }else{
                
                const dbid= db.getDb();

                dbid.collection('business').findOne({_id: new ObjectId(decodedtoken.id)})
                .then(reslut=>{
                    if(reslut){
                        res.locals.user=reslut.username;
                    next();
                    }
                    else{
                        res.locals.user='';
                        next();
                    }
                    
                })
            }

        })
    }else{
        res.locals.user='';
        next();
    }
}

//exporting

module.exports={requireBusinessAuth,checkUser};