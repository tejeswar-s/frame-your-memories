// (food,photo,gifts,event) btns
const catagorybtns=document.querySelectorAll('.maincontainer .catagories > *');

//(food,photo,gifts,events  subcatagories)
const subcatagories=document.querySelectorAll('.maincontainer .subcatagories > *');

const checkboxes=document.querySelectorAll('.subcatagories input[type="checkbox"]');

//submit btn
const submitbtn=document.querySelector('.maincontainer button');

//dropdow function
const subcatagoriesdrpdown=(e)=>{
    const dataid=e.target.getAttribute('data-id');

    subcatagories.forEach(subcatagory=>{
        if(subcatagory.getAttribute('data-id')===dataid){
            subcatagory.style.display='flex';
        }else{
            subcatagory.style.display='none';
        }
    })

}

//adding the dropdown function to btns
catagorybtns.forEach(btn=>{
    btn.addEventListener('click',subcatagoriesdrpdown,btn);
})

//to check if any of the checkboxes are checked
const ischeckedfun=()=>{
    let flag=0;

    checkboxes.forEach(checkbox=>{
        if(checkbox.checked){
            flag=1;
        }
    })

    return flag;
}

//if checkboxes are checked then enable submit btn
checkboxes.forEach(checkbox=>{
    checkbox.addEventListener('change',()=>{
        if (ischeckedfun()==1){
            submitbtn.disabled=false;
        }else{
             submitbtn.disabled=true;
        }
    })
})

const myform=document.querySelector('#myform');

myform.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  myform.submit();
});


// $(document).ready(function(){
//     $(".span").click(function(){
//       if($(this).is(":checked")){
//           $(this).parent().addClass("color-blue");
//       }else {
//           $(this).parent().removeClass("color-blue");
//       }
//     });
//   });