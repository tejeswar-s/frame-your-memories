
const express=require('express');
const customercontrollers=require('../controllers/customercontrollers');
const {requireCustomerAuth}=require('../middleware/customermiddleware');
const db = require('../db');
const { ObjectId } = require('mongodb');

const customerRoute=express.Router();

// const customerController = require('../controllers/customerController');


customerRoute.get('/customersignuplogin',customercontrollers.customersignuplogin_get);

customerRoute.post('/customerlogindetails',customercontrollers.customerlogindetails_post);

customerRoute.post('/customersignupdetails',customercontrollers.customersignupdetails_post);

customerRoute.get('/customerinterface1',requireCustomerAuth,customercontrollers.customerinterface1_get);

customerRoute.get('/customerinterface2/:catagory',requireCustomerAuth,customercontrollers.customerinterface2_get);

customerRoute.get('/mypage2',requireCustomerAuth,customercontrollers.mypage2_get);

customerRoute.post('/mypage2_edit',requireCustomerAuth,customercontrollers.mypage2_edit_post);

customerRoute.get('/customerproductaddtocart/:id',requireCustomerAuth,customercontrollers.customerproductaddtocart_id_get);

customerRoute.get('/customerentirecart',requireCustomerAuth,customercontrollers.customerentirecart_get);

customerRoute.get('/customerproductaddtowishlist/:id',requireCustomerAuth,customercontrollers.customerproductaddtowishlist_id_get);

customerRoute.get('/customerentirewishlist',requireCustomerAuth,customercontrollers.customerentirewishlist_get);

customerRoute.get('/edit_profile',requireCustomerAuth,customercontrollers.edit_profile_get);

customerRoute.get('/change_password',requireCustomerAuth,customercontrollers.change_password_get);

customerRoute.post('/chan_pass',requireCustomerAuth,customercontrollers.chan_pass_post);



customerRoute.get('/verification',(req,res)=>{
    res.render('verification');
})

customerRoute.get('/Final-payment1/:id',requireCustomerAuth,customercontrollers.Final_payment1_id_get);

customerRoute.post('/ThankYouPage',requireCustomerAuth,customercontrollers.ThankYouPage_post);

customerRoute.get('/customerentirebookings',requireCustomerAuth,customercontrollers.customerentirebookings_get);

customerRoute.get('/ratetheproduct/:id',requireCustomerAuth,customercontrollers.ratetheproduct_id_get);

customerRoute.post('/sendproductreview',requireCustomerAuth,customercontrollers.sendproductreview_post)

customerRoute.get('/customerproductdescription/:id',requireCustomerAuth,async (req,res)=>{
    const product_id=req.params.id;
    const dbobj=db.getDb();

    

    if(ObjectId.isValid(product_id)){
       await dbobj.collection('Product').findOne({_id:new ObjectId(product_id)})
        .then(async product=>{
            if(product){
            
            let location=[];

            await dbobj.collection('business').findOne({_id:new ObjectId(product.bid)}).then((result=>{
                if(result){
                    location=[...result.location];
                }
            })).catch(()=>{
                console.log('Some Error ocuured while fetching locations');
            })

            let actualproducdata=product;
            let pname=actualproducdata.pname;
            let discount=actualproducdata.pdiscount;
            let budget=actualproducdata.pbudget;
            let Availability;
            if(actualproducdata.pavailability=1){
                Availability='Available';
            }else{
                Availability='Not Available';
            }
            let category =actualproducdata.catagory;
            let subcategory=actualproducdata.subcatagory;
            
            let descrip=actualproducdata.pdescription;
            let reviews=[];
            let count=0;
            let star=0;
            if(actualproducdata.reviews){
                reviews=actualproducdata.reviews;
                count=reviews.length;
                for(let i of reviews){
                    star+=i.rating;
                    // console.log(star);
                }
                if( count!=0 ){
                    star=star/count;
                }
            }
            
            
            
    
        res.render('customerproductdescription',{count,star,discount,budget,Availability,category,subcategory,location,descrip,reviews,pname,product});
            }
            else{
                console.log('ffwef');
                res.send('Some Error Occured while fetching data');
            }
        }).catch(eror=>{
            res.status(500).send('Some Error Occured while fetching the Data');
        });
    }else{
        res.status(500).send('Not a Valid Product');
    }


    let discount=10;
    let budget=500000;
    let Availability='Available';
    let category = 'event';
    let subcategory='wedding';
    let location='All over India';
    let descrip='A destination wedding takes place in a location away from a couples hometown. Planning a destination wedding could be less expensive than planning a traditional wedding if it entails a smaller guest list or smaller reception. Using credit card points or miles can help to save money on destination wedding travel costs.';
    

})

customerRoute.get('/ContactUs',(req,res)=>{
    res.render('ContactUs',{sucess:''});
})

//form submited by customer in contact us
customerRoute.post('/customercomplaint',(req,res)=>{
    const dbobj= db.getDb();

    dbobj.collection('complaints').insertOne(req.body)
    .then(result=>{
        res.render('ContactUs',{sucess:'QUERY INTIATED'});
    })
    .catch(erroe=>{
        res.render('ContactUs',{sucess:'SOMETHING WENT WRONG'});
    })
    
})


customerRoute.get('/customerlogout',requireCustomerAuth,(req,res)=>{
    res.cookie('jwt1','',{maxAge:1});
    res.redirect('/frameyourmemories');
})

// customerRoute.get('/Final-payment',(req,res)=>{
//     res.render('Final-payment');
// });



// customerRoute.get('/Gifts',(req,res)=>{
//     res.render('Gifts');
// });

// customerRoute.get('/payment',(req,res)=>{
//     res.render('payment');
// });

// customerRoute.get('/payment1',(req,res)=>{
//     res.render('payment1');
// });

// customerRoute.get('/customerreview',(req,res)=>{
//     res.render('customerreview');
// });


module.exports = customerRoute;
