const db = require("../db");

//for restricting the user to access some webpages
const jwt=require('jsonwebtoken');

//objectid to verify the _id
const {ObjectId}=require('mongodb');

//To parse the cookie
const cookieparser=require('cookie-parser');


//setting expiry for cookie
const maxAge=3*24*60*60;//3 days 


//creating a token 
//storing it in cookie jwt
const createtoken=(id)=>{
    
    return jwt.sign({id},'a secret message',{expiresIn:maxAge});
}

//fetching businessid from request
const getbusinessId=async (req)=>{
    let deocded=undefined;
    const token=req.cookies.jwt;
    await jwt.verify(token,'a secret message',(error,decode)=>{
        if(error){
            deocded=undefined;
        }else{
            
            deocded=decode;
        }
    })
    
    return deocded.id;
}


//exporting and accessing in business routes
module.exports={
    businessinterface1_get: async (req,res)=>{
        // const bid= await getbusinessId(req);
        
        res.render('businessinterface1');
    },
    businessinterface2_get:(req,res)=>{
        const eventSubcategories = [
            'Weddings',
            'Birthdays',
            'Graduations',
            'Anniversaries',
            'Baby showers',
            'Bridal showers',
            'Retirement parties',
            'Promotions',
            'Religious celebrations',
            'Fundraisers',
            'Employee appreciation events',
            'Company picnics',
            'Customer appreciation events',
            'Product launches',
            'Store openings',
            'Art shows',
            'Film festivals',
            'Music festivals',
            'Comic conventions',
            'Sports championships',
            'Award ceremonies',
            'Art auctions',
            'Charity galas',
            'Fashion shows',
            'Concerts',
            'Dance recitals',
            'Theater productions',
            'Circus performances',
            'Magic shows',
            'Stand-up comedy'
          ];

          const foodStyles = [
            'Italian',
            'Mexican',
            'Chinese',
            'Japanese',
            'Thai',
            'Indian',
            'French',
            'Greek',
            'Turkish',
            'Lebanese',
            'Moroccan',
            'Spanish',
            'Portuguese',
            'Brazilian',
            'Peruvian',
            'Argentinian',
            'Colombian',
            'Venezuelan',
            'Caribbean',
            'Soul food',
            'Southern',
            'Cajun',
            'Creole',
            'German',
            'British',
            'Irish',
            'Scottish',
            'Russian',
            'Ukrainian',
            'Polish',
            'Swedish',
            'Norwegian',
            'Danish',
            'Finnish',
            'Vietnamese',
            'Korean',
            'Filipino',
            'Indonesian',
            'Malaysian',
            'Singaporean',
            'Cambodian',
            'Nepalese',
            'Sri Lankan',
            'Afghan',
            'Iranian',
            'Israeli',
            'Ethiopian',
            'South African',
            'Australian',
            'New Zealand',
            'American'
          ];
          
          const photographyTypes = [
            'Landscape',
            'Portrait',
            'Street',
            'Fashion',
            'Food',
            'Wildlife',
            'Sports',
            'Event',
            'Architectural',
            'Documentary',
            'Black and White',
            'Fine Art',
            'Macro',
            'Night',
            'Astrophotography',
            'Underwater',
            'Drone',
            'Travel',
            'Adventure',
            'Pet',
            'Family',
            'Wedding',
            'Boudoir',
            'Newborn',
            'Conceptual',
            'Product',
            'Real Estate',
            'Stock',
            'Time-Lapse',
            '360-Degree'
          ];
          
          
        res.render('businessinterface2',{events:eventSubcategories,food:foodStyles,photography:photographyTypes});
    },
    businessinterface3_post:(req,res)=>{
        let selectedcat=[];
        for(const i in req.body){
            selectedcat.push(i);
        }
        console.log(req.body);
        res.render('businessinterface3',{selectedcat});
    },
    p_details_to_db_post:async (req,res)=>{
        const pdetail=req.body;
        pdetail.bid=await getbusinessId(req);

        const dbobj=db.getDb();
        dbobj.collection('Product').insertOne(pdetail)
        .then(result=>{
            console.log(result);

        }).catch(err=>{
            console.log('Some Error :',err);
        })
        res.json({some:'afafsf'});
        
    },
    businessallproducts_get:async (req,res)=>{
        let products=[];
        const dbobj=db.getDb();

        const bid= await getbusinessId(req);

        dbobj.collection('Product').find({bid})
        .forEach(product=>{
            products.push(product);
        })
        .then(()=>{
            res.render('businessallproducts',{products});
        })
        .catch(()=>{
            res.status(500).send('Some error occure while fetaching');
        })
        
    },
    businessallproducts_id_get:(req,res)=>{
    
        const product_id=req.params.id;
        const dbobj=db.getDb();
        if(ObjectId.isValid(product_id)){
            dbobj.collection('Product').findOne({_id:new ObjectId(product_id)})
            .then(product=>{
                res.render('businesssingleproduct',{product});
            }).catch(eror=>{
                res.status(500).send('Some Error Occured while Fetching Data');
            });
        }else{
            res.status(500).send('Not a Valid Product');
        }
    
        
    },
    businesslocation_get:async (req,res)=>{
        const locations=[  "Naidupet",  "Sathyavedu",  "Nagalapuram",  "Varadaiahpalem",  "Tada",  "Nelapattu",  "Pulicat",  "Puttur",  "Pootharekulu",  "Rapuru",  "Perumallapalle",  "Srikalahasti",  "Sullurpeta",  "Sompalle",  "Pakala",  "Kovur",  "Nagari",  "Kadiri",  "Gudur",  "Mogili",  "Gummampalle",  "Renigunta",  "Naravaripalle",  "Pakala",  "Kavali",  "Pudi",  "Gudimangalam",  "Kundukurthi",  "Vadamalapeta",  "Vayalpad",  "Yerpedu"]
        ;

        const bid=await getbusinessId(req);
        const dbobj=db.getDb();
        let availableloc=[];
        await dbobj.collection('business').findOne({_id:new ObjectId(bid)})
        .then(reslut=>{
            if(reslut){
                if(reslut.location){
                    reslut.location.forEach(loc=>{
                        availableloc.push(loc);
                    })
                }
                
            }else{
                console.log('Not Yet Started YourJourney');
            }
        })
        // console.log(availableloc);
        res.render('businesslocation',{locations,availableloc}); 
    },

    businesslocation_post:async (req,res)=>{
        const addlocation=[];
        const dbobj=db.getDb();
        for(i in req.body){
            addlocation.push(i);
        }

        

        const bid=await getbusinessId(req);
        
        let nonCommonElements=[];
        await dbobj.collection('business').findOne({_id:new ObjectId(bid)},{location:1})
        .then(reslu=>{
            if(reslu){
                if(reslu.location){
                    nonCommonElements = addlocation.filter(element => !reslu.location.includes(element));
                }else{
                    nonCommonElements=addlocation;
                }
            }
        })

        

        dbobj.collection('business').updateOne({_id:new ObjectId(bid)},{ $push: { location: { $each: nonCommonElements } } } )
        .then(resul=>{
            
            res.redirect('/businesslocation');
        })
        .catch(err=>{
            res.send(`Some eeror : ${err}`);
        })
    },

    businessproductdelete_id_get:(req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        if(ObjectId.isValid(product_id)){
            dbobj.collection('Product').deleteOne({_id:new ObjectId(product_id)})
            .then(product=>{
                res.redirect('/businessallproducts');
            }).catch(eror=>{
                res.status(500).send('Some Error Occured while Deleting Data');
            });
        }else{
            res.status(500).send('Not a Valid Product');
        }
    },
    businessproductupdate_id_get:(req,res)=>{
        const product_id=req.params.id;
        const dbobj=db.getDb();
        if(ObjectId.isValid(product_id)){
            dbobj.collection('Product').findOne({_id:new ObjectId(product_id)})
            .then(result=>{     
                res.render('businessproductupdate',{Product:result});
            }).catch(error=>{
                res.status(501).send(`Some Error Occured : ${error}`);
            })
        }else{
            res.send('not valid');
        }
        
    },
    bpage4_post:(req,res)=>{
        const Product=req.body;
        const dbobj=db.getDb();
        const obj={
            catagory:Product.catagory,
            subcatagory:Product.subcatagory,
            pname:Product.pname,
            pavailability:Product.pavailability,
            pbudget:Number(Product.pbudget),
            pdiscount:Number(Product.pdiscount),
            pdescription:Product.pdescription
            };
        dbobj.collection('Product').updateOne({_id:new ObjectId(Product._id)},{$set:obj})
            .then(result=>{
                console.log(result);
                res.json({success:'SuccessFully updated the Document'})
            }).catch(error=>{
                console.log(`some error : ${error}`)
                res.json({someerror:`Some error occured while Updating : ${error}`});
            })
    },

    businesssignupdetails_post:(req,res)=>{
        const dbobj=db.getDb();

        dbobj.collection('business').findOne({email:req.body.myMail})
        .then(result=>{
            if(result){
                res.render('businesssignuplogin',{wrongPassword:'',alreadyexsists:'Accout Already Exsists'});
            }else{
                dbobj.collection('business').insertOne({email:req.body.myMail,username:req.body.myName,password:req.body.myPassword})
                .then(async result1=>{
                    const token=await createtoken(result1._id);
                    console.log(result1._id);
                    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                    res.render('registration',{mail:req.body.myMail});
                })
                .catch(erore1=>{
                    res.send(`Some Error Occured While inserting Details of user : ${erore1}`);
                })
            }
        })
        .catch(error2=>{
            res.send(`Some Error Occured While inserting Details of user : ${error2}`);
        })
    },

    addbusinessdetails_post:(req,res) => {

        const Name = req.body.name
        const Email = req.body.email_id
        const Pan = req.body.pan_no
        const Exp = req.body.exp_no
        const Phone = req.body.phn_no
        const Dob = req.body.date_birth
        const Img_url = req.body.imgname
        const Gend = req.body.gender
        const Add1 = req.body.add_1
        const Add2 = req.body.add_2
        const City = req.body.city_name
        const Reg = req.body.reg_name
        const Pin = req.body.pin_no;
        const dbobj=db.getDb();
        dbobj.collection('EveryBDetails')
        .insertOne({ name:Name,email:Email,pan : Pan, exp : Exp, phone: Phone, dob: Dob, imgname : Img_url, gender :Gend, add_1 : Add1, add_2 : Add2, city_name : City, reg_name : Reg, pin_no : Pin })
        .then(result => {
            res.status(201).send('Please Waiit until we verify you');
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new businessman'});
        })
    },

    businesslogindetails_post:(req,res)=>{
        const dbobj=db.getDb();
        dbobj.collection('business').findOne({email:req.body.myMail})
        .then(result=>{
            if(result){
                if(result.password==req.body.myPassword){
                    const token=createtoken(result._id);
    
                    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                    res.redirect('/businessinterface1');
                }else{
                    res.render('businesssignuplogin',{wrongPassword:`Incorrect Credentials`,alreadyexsists:''});
                }
            }
            else{
                res.render('businesssignuplogin',{wrongPassword:`Mail Doesn't Exsist`,alreadyexsists:''});
            }
        })
    },

    addbusinessman_post:(req,res)=>{
        
        let newobj=req.body;
        newobj.email=req.body.email_id;
        delete newobj.email_id;
        newobj.username=req.body.name;
        // console.log(req.body);
        // console.log(newobj,'hbjb ');
        const dbobj=db.getDb();
        dbobj.collection('business').updateOne({email:newobj.email},{$set:newobj})
        .then((result)=>{
            res.redirect('/verification');
        })
        .catch(err=>{
            res.send(`Some Error : ${err}`);
        })
        // res.send(req.body);
    },

    businesslogout_get:(req,res)=>{
        res.cookie('jwt','',{maxAge:1});
        res.redirect('/frameyourmemories');
    }
    ,
    businessorders_get:async (req,res)=>{
        const userid=await getbusinessId(req);
        let products=[];
        const dbobj=db.getDb();

        await dbobj.collection('business').findOne({_id:new ObjectId(userid)}).then((result)=>{
            if(result){
                if(result.orders){
                    res.render('businessorders',{products:result.orders})
                }
                else{
                    res.render('businessorders',{products:products})
                }
            }else{
                res.render('businessorders',{products:products})
            }
        }).catch((err)=>{
            res.send('Some Error Occured while fetching the Oreders')
        })
    }

};