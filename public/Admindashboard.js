const partner=document.querySelector('#partner');
const partner1=document.querySelector('.partner1');
const client=document.querySelector('#Client');
const client1=document.querySelector('.clients1');
const registrations=document.querySelector('#Breg');
const registrations1=document.querySelector('.Breg1');
const complaints=document.querySelector('#complaints');
const complaints1=document.querySelector('.complaints1');
// const finance=document.querySelector('#Finance');
// const finance1=document.querySelector('.finance1');
const partnerdetails=document.querySelectorAll('.partdetails');
const clientdetails=document.querySelectorAll('.clientdetails')

partner.addEventListener('click', ()=>{
    partner.style.background="white";
    partner.style.borderTopLeftRadius="15px" ;
    partner.style.borderBottomLeftRadius="15px";
    client.style.backgroundColor="#111";
    registrations.style.backgroundColor="#111";
    complaints.style.backgroundColor="#111";
    // finance.style.backgroundColor="#111";
    partner1.style.display="block";
    client1.style.display="none";
    // finance1.style.display="none";
    complaints1.style.display="none";
    registrations1.style.display="none";
}) 

client.onclick = ()=>{
    client.style.background="white";
    client.style.borderTopLeftRadius="15px" ;
    client.style.borderBottomLeftRadius="15px";
    partner.style.backgroundColor="#111";
    registrations.style.backgroundColor="#111";
    complaints.style.backgroundColor="#111";
    // finance.style.backgroundColor="#111";
    partner1.style.display="none";
    client1.style.display="block";
    // finance1.style.display="none";
    complaints1.style.display="none";
    registrations1.style.display="none";
}

registrations.onclick = ()=>{
    registrations.style.background="white";
    registrations.style.borderTopLeftRadius="15px" ;
    registrations.style.borderBottomLeftRadius="15px";
    client.style.backgroundColor="#111";
    partner.style.backgroundColor="#111";
    complaints.style.backgroundColor="#111";
    // finance.style.backgroundColor="#111";
    partner1.style.display="none";
    client1.style.display="none";
    // finance1.style.display="none";
    complaints1.style.display="none";
    registrations1.style.display="block";
}

complaints.onclick = ()=>{
    complaints.style.background="white";
    complaints.style.borderTopLeftRadius="15px" ;
    complaints.style.borderBottomLeftRadius="15px";
    client.style.backgroundColor="#111";
    registrations.style.backgroundColor="#111";
    partner.style.backgroundColor="#111";
    // finance.style.backgroundColor="#111";
    partner1.style.display="none";
    client1.style.display="none";
    // finance1.style.display="none";
    complaints1.style.display="block";
    registrations1.style.display="none";
}

// finance.onclick = ()=>{
//     finance.style.background="white";
//     finance.style.borderTopLeftRadius="15px" ;
//     finance.style.borderBottomLeftRadius="15px";
//     client.style.backgroundColor="#111";
//     registrations.style.backgroundColor="#111";
//     complaints.style.backgroundColor="#111";
//     partner.style.backgroundColor="#111";
//     partner1.style.display="none";
//     client1.style.display="none";
//     finance1.style.display="block";
//     complaints1.style.display="none";
//     registrations1.style.display="none";
// }

console.log(partnerdetails);

const namesearchfunction=()=>{
    
    
    let searchedname=document.querySelector('#mynamesearch');
    
    let regexp=new RegExp(searchedname.value.trim(),'i')
    partnerdetails.forEach(onepart=>{
        if(regexp.test(onepart.getAttribute('data-partnername'))){
            onepart.style.display='grid';
        }else{
            onepart.style.display='none';
        }
    })
}

const namesearchfunctionc=()=>{
    
    
    let searchedname=document.querySelector('#mynamesearchc');
    
    let regexp=new RegExp(searchedname.value.trim(),'i')
    clientdetails.forEach(onepart=>{
        if(regexp.test(onepart.getAttribute('data-cname'))){
            onepart.style.display='grid';
        }else{
            onepart.style.display='none';
        }
    })
}