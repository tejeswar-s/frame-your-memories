const photobtns  =  document.querySelectorAll('.maincontain .photobtn button');
//for btns

const photodivs=document.querySelectorAll('.maincontain .photobtn div');

const acontent=document.querySelectorAll('.maincontain .acontent');

//adding event listien for the btns
photobtns.forEach(btn=>{
    btn.addEventListener('click',(btn)=>{
        // console.log(btn.target);
        photodivs.forEach(div=>{
            if(div.getAttribute('data-id').localeCompare(btn.target.getAttribute('data-id'))==0)
            {
                // div.style.display='none';
                div.style.opacity='0';
                div.style.zIndex='-1';
                // console.log(div);
                for(let i of acontent){
                    if(i.getAttribute('data-id').localeCompare(btn.target.getAttribute('data-id'))==0){
                        i.style.display='flex';
                        i.style.opacity='1';
                        
                        
                    }else{
                        i.style.display='none';
                        i.style.opacity='0';
                    }
                    // console.log(i);
                    
                }
            }else{
                // div.style.display='flex';
                div.style.opacity='1';
                div.style.zIndex='1';
            }
        })
        

    })
})

function signupvalidation(){
    const email=document.querySelectorAll('.acontent input[type="email"]');
    const nam1=document.querySelector('.acontent input[type="text"]');
    let regexp=/^([a-z0-9\.-]+)@([a-z0-9-]+)\.([a-z]{2,5})(\.[a-z]{2,4})?$/;
    console.log(email[1].value);
    if (!(regexp.test(email[1].value)))
  {
    email[1].style.border='1px solid red';
    console.log(email[1].style);
    // alert('jhbsf');
    return (false);
  }
  else if(nam1.value.trim()==''){
    nam1.style.border='1px solid red';
    return false;
  }
  else{
    console.log('uyrw');
    return true;
  }
}

function loginvalidation(){
    const email=document.querySelectorAll('.acontent input[type="email"]');
    let regexp=/^([a-z0-9\.-]+)@([a-z0-9-]+)\.([a-z]{2,5})(\.[a-z]{2,4})?$/;
    if(!(regexp.test(email[0].value)))
    {
        email[0].style.border='1px solid red';
        // alert('saasf');
        return false;
    }
    else{
        return true;
    }
}

