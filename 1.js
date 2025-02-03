
const express=require('express');

//ObjectId to verify the mongodb _id
const { ObjectId }=require('mongodb');

//importing the database connection from db.js
const {connectToDb,getDb}=require('./db');

//To set the cookie without using res.header();
const cookieparser=require('cookie-parser');

const {requireBusinessAuth,checkUser}=require('./middleware/businessmiddleware');

//importing business routes 
const businessroutes=require('./routes/businessroutes');

//importing all the customer routes 
const customerroutes=require('./routes/customerroutes');

//importing all admin routes 
const adminroutes=require('./routes/adminroutes');

const app=express();

//databse object
let db; 

//connects to the database and server starts listening 
connectToDb((error)=>{
    if(!error){
        //only if the connection is created the server starts listening
        app.listen(3000,()=>{
            console.log('Server listening on : http://localhost:3000/frameyourmemories');
        })
        db=getDb();
    }
})

//setting ejs as view engine
app.set('view engine','ejs');

//making all the files in public accessable to server
app.use(express.static('public'));

//To enconde the data in request body
app.use(express.urlencoded());

//to parse the json object
app.use(express.json());

//Used to parse the cookies
app.use(cookieparser());

//route to the landing page
app.get('/Frameyourmemories',(req,res)=>{
    res.render('final-home');
})

//About use
app.get('/aboutus',(req,res)=>{
    res.render('AboutUs');
})

//All the admin related routes
app.use(adminroutes);

//handles all the customer routes
app.use(customerroutes);

//handles all the requests
app.get('*',checkUser);

//handles all the business routes
app.use(businessroutes);


//final middleware which handles request if no other previous middleware provides response 
app.use((req,res)=>{
    res.send('404 Error Occured');
})