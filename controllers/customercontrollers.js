//jwt to create a session
const jwt=require('jsonwebtoken');

//To get the database object in order to manipulate the database
const db = require('../db');

//To verify if _id is valid or not
const {ObjectId}=require('mongodb');

//To parse the cookie
const cookieparser=require('cookie-parser');

//expiring the cookie after 3 days
const maxAge=3*24*60*60;//3 days 

//creating a token for customer and storing it in cookie jwt1
const createtoken=(id)=>{
    
    return jwt.sign({id},'a secret message',{expiresIn:maxAge});
}

//functio that returns customer id in token which is stored in cookie
const getcustomerId=async (req)=>{
    let deocded=undefined;
    const token=req.cookies.jwt1;
    await jwt.verify(token,'a secret message',(error,decode)=>{
        if(error){
            deocded=undefined;
        }else{
            
            deocded=decode;
        }
    })
    
    return deocded.id;
}

module.exports={
    customersignuplogin_get:(req,res)=>{
        res.render('customersignuplogin',{wrongPassword:'',alreadyexists:''});
    },

    customerlogindetails_post:async(req,res)=>{
        const dbobj=db.getDb();
    
        dbobj.collection('details').findOne({email:req.body.myMail})
        .then(async result=>{
            if(result){
                if(result.password == req.body.myPassword){

                    const token=createtoken(result._id);
    
                    res.cookie('jwt1',token,{httpOnly:true,maxAge:maxAge*1000});

                    res.render('customerinterface1');
                }
                else{
                    res.render('customersignuplogin',{wrongPassword:'Incorrect Credentials',alreadyexists:''}) 
                }
                
            }
            else{
                res.render('customersignuplogin',{wrongPassword:'Incorrect Credentials',alreadyexists:''})
            }
        })
    },

    customersignupdetails_post:async(req,res)=>{
        console.log('sfsf',req.body);
        const dbobj=db.getDb();
        try{
             await dbobj.collection('details').findOne({email:req.body.myMail}).then(async (result)=>{
                if(result){
                    res.render('customersignuplogin',{wrongPassword:'',alreadyexists:'Account already exists'})
                }
                else{
                     await dbobj.collection('details').insertOne({name:req.body.myName,email:req.body.myMail,password:req.body.myPassword})
                     .then(result1=>{
                        if(result1){

                            const token=createtoken(result1._id);

                    res.cookie('jwt1',token,{httpOnly:true,maxAge:maxAge*1000});

                            res.render('customersignuplogin',{wrongPassword:'',alreadyexists:''});
                        }
                        else{
                            res.send('Some Error Occured While inserting Details of user');
                        }
    
                        })
                }
            })   
            }
        catch(error){
            console.log(error.message,'sgsgg');
            res.send(`Some Error Occured : ${error}`);
        }
    },

    customerinterface1_get:async (req,res)=>{
        const cid=await getcustomerId(req);
        console.log(cid,'jhvgh');
        res.render('customerinterface1');
    },

    customerinterface2_get:(req,res)=>{
        const catagory=req.params.catagory;
        const dbobj=db.getDb();
        let products=[]
        dbobj.collection('Product').find({pavailability:1})
        .forEach(product=>{
            products.push(product);
        })
        .then(()=>{
            res.render('customerinterface2',{products,sucess:'',catagory});
        })
        .catch((err)=>{
            res.send(`Some Error Occured While Fetching The Products : ${err}`);
        })
    },

    customerproductaddtocart_id_get:async (req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        
        const userid=await getcustomerId(req);
        if(ObjectId.isValid(product_id)){
            dbobj.collection('details').updateOne({_id:new ObjectId(userid)},{ $push: { orders: product_id } })
            .then(product=>{
                res.redirect('/customerentirecart');
            }).catch(eror=>{
                res.status(500).send('Some Error Occured while Inserting into cart Data');
            });
        }else{
            res.status(500).send('Not a Valid Product');
        }
        
    },
    customerentirecart_get:async (req,res)=>{
        const userid=await getcustomerId(req);

        let productslist=[];

        const dbobj=db.getDb();

        await dbobj.collection('details').findOne({_id:new ObjectId(userid)}).then(result=>{
            if(result){
                
                if(result.orders.length>0){
                    productslist= result.orders.slice();
                    // console.log(productslist,'sdfsf')
                }
                
            }
        }).catch(err=>{
            console.log(`Some Error Occured : ${err}`);
        });

        let updatedlist=[];
        let allcartp=[];
        
        if(productslist.length>0){
            productslist.forEach(product=>{
                updatedlist.push(new ObjectId(product))
            });
            
           

            await dbobj.collection('Product').find({_id:{$in:updatedlist}})
            .forEach(sproduct=>{
                allcartp.push(sproduct);
            }).then(()=>{
                // console.log(allcartp);
                res.render('customercart',{products:allcartp});
            }).catch((err)=>{
                res.send(`Some Error Occured While Fetching The cart : ${err}`);
            })

        }else{
            res.render('customercart',{products:allcartp});
        }
    },

    edit_profile_get:async (req,res)=>{
        
        const userid=await getcustomerId(req);
        const dbobj=db.getDb();
        await dbobj.collection('details').findOne({_id:new ObjectId(userid)})
        .then((result)=>{
            res.render('edit_profile',{mail:result.email});
        })
        .catch((erre)=>{
            res.send(`Some error Occured while fetching mail : ${erre}`);
        })

        
    },
    
    mypage2_get:async (req,res)=>{
        const userid=await getcustomerId(req);
            const dbobj=db.getDb();
            await dbobj.collection('details').findOne({_id:new ObjectId(userid)})
            .then((result)=>{
                res.render('mypage2',{name:result.name});
            })
            .catch((erre)=>{
                res.send(`Some error Occured while fetching name : ${erre}`);
            })
    },

    change_password_get:(req,res)=>{
        res.render('change_password',{sucesstext:''});

    }
    ,

    mypage2_edit_post:async (req,res)=>{
        console.log(req.body);
        const userid=await getcustomerId(req);
            const dbobj=db.getDb();
            await dbobj.collection('details').updateOne({_id:new ObjectId(userid)},{$set:{name:req.body.name1}})
            .then((result)=>{
                res.redirect('mypage2');
            })
            .catch((erre)=>{
                res.send(`Some error Occured while Updating details : ${erre}`);
            })
    }
    ,
    customerproductaddtowishlist_id_get:async (req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        
        const userid=await getcustomerId(req);
        if(ObjectId.isValid(product_id)){
            dbobj.collection('details').updateOne({_id:new ObjectId(userid)},{ $push: { wishlist: product_id } })
            .then(product=>{
                res.redirect('/customerentirewishlist');
            }).catch(eror=>{
                res.status(500).send('Some Error Occured while Inserting into cart Data');
            });
        }else{
            res.status(500).send('Not a Valid Product');
        }
        
    },

    customerentirewishlist_get:async (req,res)=>{
        const userid=await getcustomerId(req);

        let productslist=[];

        const dbobj=db.getDb();

        await dbobj.collection('details').findOne({_id:new ObjectId(userid)}).then(result=>{
            if(result){
                
                if(result.wishlist.length>0){
                    productslist= result.wishlist.slice();
                    // console.log(productslist,'sdfsf')
                }
                
            }
        }).catch(err=>{
            console.log(`Some Error Occured : ${err}`);
        });

        let updatedlist=[];

        if(productslist.length>0){
            productslist.forEach(product=>{
                updatedlist.push(new ObjectId(product))
            });
            
            let allcartp=[];

            await dbobj.collection('Product').find({_id:{$in:updatedlist}})
            .forEach(sproduct=>{
                allcartp.push(sproduct);
            }).then(()=>{
                
                res.render('customerwishlist',{products:allcartp})
            }).catch((err)=>{
                res.send(`Some Error Occured While Fetching The wishList : ${err}`);
            })

        }else{
            res.send('No Orders Yet');
        }
    },

    Final_payment1_id_get:async (req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        console.log(product_id);
        if(ObjectId.isValid(product_id)){
           await dbobj.collection('Product').findOne({_id:new ObjectId(product_id)})
            .then(product=>{
                if(product){
                    
                    res.render('Final-payment1',{product});
                }else{
                    res.send(`Product Was not Found`);
                }
                
            }).catch(eror=>{
                res.status(500).send('Some Error Occured while Intiating the Payment');
            });
        }else{
            res.status(500).send('Not a Valid Product');
        }

        

    },

    ThankYouPage_post:async (req,res)=>{
        
        let productid=req.body.pid;
        let customerid=await getcustomerId(req);
        let newobj={...req.body};
        
        delete newobj.one;
        delete newobj.order;


        const dbobj=db.getDb();

         //remove product from customer cart
       await dbobj.collection('details').updateOne({_id:new ObjectId(customerid)},{$pull:{orders:productid}}).then(result=>{
        console.log('succes in removing product from cart');
       }).catch(()=>{
        console.log('Some Error occured in deleting product from cart')
       })

       //indicatio to the user that there is an order to him
       await dbobj.collection('Product').findOne({_id:new ObjectId(productid)}).then(async result=>{
        if(result){
            await dbobj.collection('business').updateOne({_id: new ObjectId(result.bid)},{$push:{orders:newobj}}).then(()=>{
                console.log('Sucssfully indicated the Service provider');
            }).catch(()=>{
                console.log('Some Error occured while indicating service provider')
            })
        }
       }).catch(()=>{
        console.log('Some Error Occured While informing the service provider')
       })

         //adding details into bookings of customer
        dbobj.collection('Bookings').insertOne({customerid,productid}).then((result)=>{
            res.render('Final-payment');
        }).catch(err=>{
            res.send('Some Error Occured ')
        })
        
        
    },

    customerentirebookings_get:async (req,res)=>{
        let customerid=await getcustomerId(req);
        let dbobj=db.getDb();

        //product ids
        let bookings=[];

        await dbobj.collection('Bookings').find({customerid}).forEach(booking=>{
            bookings.push(new ObjectId(booking.productid));
        }).then(()=>{
            console.log('Sucessfuly fetched data from bookings')
            
            
        })
        .catch((err)=>{
            console.log('some Error ');
            
        })

        let products=[];

        dbobj.collection('Product').find({_id:{$in:bookings}}).forEach(product=>{
            products.push(product);
        }).then(()=>{
            
            res.render('customerbookings',{products});
        })
        .catch((err)=>{
            res.send('Some Error Occured While Fetching Books');
        })

        

        
    },

    ratetheproduct_id_get:async (req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        

        

        if(ObjectId.isValid(product_id)){
           
            res.render('customerreview',{product_id:product_id});
            
        }else{
            res.status(500).send('Not a Valid Product');
        }

    },
    sendproductreview_post:async (req,res)=>{
        const product_id=req.body.pid;
        const rating=Number(req.body.rate);
        const review=req.body.review;

        const dbobj=db.getDb();

        let customerid=await getcustomerId(req);

        let username;
        await dbobj.collection('details').findOne({_id:new ObjectId(customerid)}).then((result)=>{
            if(result){
                username=result.name;
            }
        })

        let reviewobj={
            name:username,
            rating:rating,
            review:review
        }
        
        
        
        if(ObjectId.isValid(product_id)){
           
           await dbobj.collection('Product').updateOne({_id:new ObjectId(product_id)},{$push:{reviews:reviewobj}})
            .then((result)=>{
                if(result){
                    res.render('review2');
                }else{
                    res.send('NO SUCH PRODUCT EXISTS');
                }
                
            }).catch((eer)=>{
                res.send('Some Error Occured While sending review');
            })
            
            
        }else{
            res.status(500).send('Not a Valid Product');
        }
    }
    ,
    chan_pass_post:async (req,res)=>{
        console.log(req.body);

        const userid=new getcustomerId(req);

        const dbobj=db.getDb();

        await dbobj.collection('details').updateOne({_id:new ObjectId(userid),password:req.body.old-password},{$set:{password:req.body.new-password}}).then((result)=>{
            if(result){
                res.render('change_password',{sucesstext:'Successfully changed'});
            }else{
                
                res.render('change_password',{sucesstext:'Incorrect password'});
            }
        }).catch((err)=>{
            res.render('change_password',{sucesstext:'Error while setting password'});
        })

        res.send('duccess');
    }


}