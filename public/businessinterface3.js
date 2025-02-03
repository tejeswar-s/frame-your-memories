const servicebtns=document.querySelectorAll('.servicecontainer .services span');

const addservice=document.querySelector('.servicecontainer .addservice');

const addsubbtn=document.querySelector('.addservice button');

const sucesstext=document.querySelector('.success');

const myinput=    document.querySelectorAll('.addservice input');



const submitdrpdwn=(e)=>{
    const cat_subcat=e.target.getAttribute('data-catagory'); 
    addservice.style.display='flex';
    sucesstext.style.display='none';
    const forminputs=document.querySelectorAll('.addservice input');
    forminputs.forEach(singleinput=>{
        if(!(singleinput.type==='checkbox')){
            singleinput.value='';
        }else{
            singleinput.checked='false';
        }
    })
    const pdesc=document.querySelector('.addservice textarea');
    pdesc.value='';
    myinput[0].value=cat_subcat.split(' ')[0];
    myinput[1].value=cat_subcat.split(' ')[1];
    

}

servicebtns.forEach(btn=>{
    btn.addEventListener('click',submitdrpdwn,btn)
    btn.addEventListener('click',()=>{
        servicebtns.forEach(btn1=>{
            if(btn1==btn){
                btn1.style.background="darkolivegreen";
                btn1.style.color="white";
            }else{
                btn1.style.background="darkslategrey";
                btn1.style.color="white";
            }
        })
    })
})


addsubbtn.addEventListener('click',async ()=>{

        const forminputs=document.querySelectorAll('.addservice input');

        const formdvalues=[];
        
        forminputs.forEach(singleinput=>{
            if(!(singleinput.type==='checkbox')){
                formdvalues.push(singleinput.value);
            }else if(singleinput.checked){
                formdvalues.push(1);
            }else{
                formdvalues.push(0);
            }
            
        })

        const pdesc=document.querySelector('.addservice textarea').value;

        const obj={
            catagory:formdvalues[0],
            subcatagory:formdvalues[1],
            pname:formdvalues[2],
            pavailability:formdvalues[3],
            pbudget:Number(formdvalues[4]),
            pdiscount:Number(formdvalues[5]),
            pdescription:pdesc,
            image1:formdvalues[6]
        };

        const errormessagediv=document.querySelector('.errormess');

        let pnameregexp=new RegExp('^[a-zA-Z][a-zA-Z\s_]');
        let pdescregexp=new RegExp('');
        
        if(!pnameregexp.test(formdvalues[2])){
            errormessagediv.innerHTML='Invalid Product Name';
            return false;
        }

        if(!(Number(formdvalues[4])>0)){
            errormessagediv.innerHTML=`Invalid Cost`;
            return false;
        }

        if(!(Number(formdvalues[5]) >0 && Number(formdvalues[5])<=100 && formdvalues[5])){
            errormessagediv.innerHTML=`Invalid Discount`;
            return false;
        }

        if(!pdesc.trim()){
            errormessagediv.innerHTML=`Invalid Description`;
            return false;
        }

        if(!formdvalues[6].trim()){
            errormessagediv.innerHTML=`Invaild URL field`;
            return false;
        }


        try{
        await fetch('/p_details_to_db',{
            method:'POST',
            body:JSON.stringify(obj),
            headers:{'Content-Type':'application/json'}
        })
        .then(resul=>{
            console.log('sucess');
        }).catch(err=>{
            console.log('some ERRROR in .ca')
        })
    }catch(err){
        console.log('fwfwf catch',err);
        // location.assign('/businessinterface2');
    }

    addservice.style.display='none';
    sucesstext.style.display='block';
    errormessagediv.innerHTML=``;
})