//jwt to create a session
const jwt=require('jsonwebtoken');

//To get the database object in order to manipulate the database
const db = require('../db');

//objectId() to convert string into ObectId
const {ObjectId}=require('mongodb');

//Using this middleware to protect the Admin routes
//Verifies if user is allowed to access restricted pages or not
const requireAdminAuth=async (req,res,next)=>{
    const token=req.cookies.jwt2;
    
    if(token){
        jwt.verify(token,'a secret message',async (error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.redirect('/adminlogin');
            }else{
                const dbobj=db.getDb();
                // console.log(decodedtoken.id);
                await dbobj.collection('adminlogin').findOne({_id:new ObjectId(decodedtoken.id)})
                .then(result=>{
                    if(result){
                        next();
                    }else{
                        console.log('NOt found');
                        res.redirect('/adminlogin');
                    }
                })
                .catch(()=>{
                    res.redirect('/adminlogin');
                })
            }

        })
            
        
    }else{
        res.redirect('/adminlogin');
    }
}

//exporting
module.exports={requireAdminAuth};