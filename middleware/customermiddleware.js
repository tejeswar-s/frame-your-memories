//jwt to create a session
const jwt=require('jsonwebtoken');

//importing the db to get databse object
const db = require('../db');

//objectId() to convert string into ObectId
const {ObjectId}=require('mongodb');

//Protecting the Customer from unauthorized users
const requireCustomerAuth=async (req,res,next)=>{
    const token=req.cookies.jwt1;
    
    if(token){
        jwt.verify(token,'a secret message',async (error,decodedtoken)=>{
            if(error){
                console.log(error.message);
                res.redirect('/customersignuplogin');
            }else{
                const dbobj=db.getDb();
                await dbobj.collection('details').findOne({_id:new ObjectId(decodedtoken.id)})
                .then(result=>{
                    if(result){
                        // console.log('as',result);
                        next();
                    }
                    else{
                        
                        res.redirect('/customersignuplogin');
                    }
                })
                .catch(()=>{
                    res.redirect('/customersignuplogin');
                })
            }

        })
        
            
        
    }else{
        
        res.redirect('/customersignuplogin');
    }
}


module.exports={requireCustomerAuth};