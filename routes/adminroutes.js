const express=require('express');
const db = require('../db');
const { ObjectId } = require('mongodb');
const router=express.Router();
const jwt=require('jsonwebtoken');

const cookieparser=require('cookie-parser');

const maxAge=3*24*60*60;//30 days 

const {requireAdminAuth}=require('../middleware/adminmiddleware');

//creating a token 
//storing it in cookie jwt2
const createtoken=(id)=>{
    
    return jwt.sign({id},'a secret message',{expiresIn:maxAge});
}

const getallcomplaints=async ()=>{
    const dbobj=db.getDb();
    let allcomplaints=[];
    await dbobj.collection('complaints').find()
    .forEach(complaint=>{
        allcomplaints.push(complaint);
    })
    .then(()=>{
        
    })
    .catch((err)=>{
        console.log(err);
    })
    return allcomplaints;
}

const getallBookings=async ()=>{
    const dbobj=db.getDb();
    let Bookings=[];
    await dbobj.collection('Bookings').find()
    .forEach(Booking=>{
        Bookings.push(Booking);
    })
    .then(()=>{
        
    })
    .catch(()=>{
        console.log(`Some Error Occured while Fetching booking details `);
    })
    return Bookings;
}

const getpartnerdetails=async (condition1)=>{
    const dbobj=db.getDb();
    let partners=[];
    await dbobj.collection('business').find(condition1)
    .forEach(partner=>{
        partners.push(partner);
    })
    .then(()=>{
        
    })
    .catch(()=>{
        console.log(`Some Error Occured while Fetching partner details `);
    })
    return partners;
}

const getproud=async ()=>{
    const dbobj=db.getDb();
    let products=[];
    await dbobj.collection('Product').find()
    .forEach(prod=>{
        products.push(prod);
    })
    .then(()=>{
        
    })
    .catch(()=>{
        console.log(`Some Error Occured while Fetching product details `);
    })
    return products;
}

const getclients=async ()=>{
    const dbobj=db.getDb();
    let clients=[];
    await dbobj.collection('details').find()
    .forEach(client=>{
        clients.push(client);
    })
    .then(()=>{
        
    })
    .catch(()=>{
        console.log(`Some Error Occured while Fetching client details `);
    })
    return clients;
}

const getreviews=async ()=>{
    const dbobj=db.getDb();
    let reviews=[];
    await dbobj.collection('Product').find()
    .forEach(product=>{
        // forEach(product.reviews=>{
        //     clients.push(client);
        // })
if(product&&product.reviews){
        product.reviews.forEach(onereview=>{
            reviews.push(onereview);
        })
    }else{

    } 
    })
    .then(()=>{
        
    })
    .catch((err)=>{
        console.log(err,'gy');
    })
    return reviews;
}




router.get('/adminlogin',(req,res)=>{
    res.render('adminlogin',{wrongPassword:''});
})

router.post('/adminlogindetails',(req,res)=>{
    
    const dbobj=db.getDb();

    dbobj.collection('adminlogin').findOne({email:req.body.myemail,adminid:req.body.myid,password:req.body.mypassword})
    .then(result=>{
        if(result){
            const token=createtoken(result._id);
    
            res.cookie('jwt2',token,{httpOnly:true,maxAge:maxAge*1000});
            
            res.redirect('/Admindashboard');

        }else{
            res.render('adminlogin',{wrongPassword:'Incorrect Credentials'})
        }
    })

})

router.get('/Admindashboard',requireAdminAuth,async (req,res)=>{

    const complaints=await getallcomplaints();
    let condition1={isverified:true};
    const partners=await getpartnerdetails(condition1);

    let condition2={isverified:{$nin:[true]}};
    const registrations=await getpartnerdetails(condition2);

    const products=await getproud();
    const clients = await getclients();

    const bookings=await getallBookings();
    const reviews=await getreviews();

    
    let sales=30;
   let partnum=51;
   let noofprod=30;
    
    let noofrev = 500;
    let revenue = 10000000;
    
    // console.log(partners);

    res.render('Admindashboard',{partnum,noofprod,sales,noofrev,revenue,complaints,partners,products,clients,registrations,bookings,reviews});
});

router.get('/adminverify/:id',requireAdminAuth,(req,res)=>{
    const b_id=req.params.id;
        const dbobj=db.getDb();
        
        if(ObjectId.isValid(b_id)){
            dbobj.collection('business').updateOne({_id:new ObjectId(b_id)},{$set:{isverified:true}})
            .then(result=>{     
                res.redirect('/Admindashboard');
            }).catch(error=>{
                res.status(501).send(`Some Error Occured : ${error}`);
            })
        }else{
            res.send('not valid id');
        }
        
    }
)

router.get('/adminlogout',requireAdminAuth,(req,res)=>{
    res.cookie('jwt2','',{maxAge:1});
    res.redirect('/frameyourmemories');
})

module.exports=router;