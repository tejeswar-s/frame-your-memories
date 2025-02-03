const express=require('express');
const businesscontrollers=require('../controllers/businesscontrollers');
const {requireBusinessAuth}=require('../middleware/businessmiddleware');

const router=express.Router();


router.get('/businesssignuplogin',(req,res)=>{
    res.render('businesssignuplogin',{wrongPassword:'',alreadyexsists:''});
})

router.post('/businesssignupdetails',businesscontrollers.businesssignupdetails_post);



router.post('/businesslogindetails',businesscontrollers.businesslogindetails_post);


router.get('/businessinterface1',requireBusinessAuth,businesscontrollers.businessinterface1_get);

router.get('/businessinterface2',requireBusinessAuth,businesscontrollers.businessinterface2_get);

router.post('/businessinterface3',requireBusinessAuth,businesscontrollers.businessinterface3_post);

router.post('/addbusinessdetails',businesscontrollers.addbusinessdetails_post);

router.post('/addbusinessman',businesscontrollers.addbusinessman_post);

router.post('/p_details_to_db',requireBusinessAuth,businesscontrollers.p_details_to_db_post);


router.get('/businessallproducts',requireBusinessAuth,businesscontrollers.businessallproducts_get);

router.get('/businessallproducts/:id',requireBusinessAuth,businesscontrollers.businessallproducts_id_get);

router.get('/businesslocation',requireBusinessAuth,businesscontrollers.businesslocation_get);

router.post('/businesslocation',requireBusinessAuth,businesscontrollers.businesslocation_post);

router.get('/businessproductdelete/:id',requireBusinessAuth,businesscontrollers.businessproductdelete_id_get);

router.get('/businessproductupdate/:id',requireBusinessAuth,businesscontrollers.businessproductupdate_id_get);

router.post('/bpage4',requireBusinessAuth,businesscontrollers.bpage4_post);

router.get('/businesslogout',requireBusinessAuth,businesscontrollers.businesslogout_get);

router.get('/businessorders',requireBusinessAuth,businesscontrollers.businessorders_get);
module.exports=router;