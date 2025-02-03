const btn = document.querySelector("button");
      const post = document.querySelector(".post");
      const widget = document.querySelector(".star-widget");
      const editBtn = document.querySelector(".edit");
      const head=document.querySelector(".head");
      const cont=document.querySelector('.container');
      const text=document.querySelector(".text")
      btn.onclick = ()=>{
        widget.style.display = "none";
        post.style.display = "block";
        cont.style.background="none";
        text.style.color="green";
        head.style.display="none";
        return false;
      }

      document.querySelector('#files').addEventListener("change",(e)=>{
	if(window.File && window.FileReader &&window.FileList && window.Blob){
		const files=e.target.files;
		const output=document.querySelector("#result");
		for(let i=0;i<files.length;i++){
			if(!files[i].type.match("image")) continue;
			const picreader=new FileReader();
			picreader.addEventListener("load",function(event){
				const picFile=event.target;
				const div=document.createElement("div");
				div.innerHTML=`<img class="thumbnail" src="${picFile.result}" title="${picFile.name}"/>`;
				output.appendChild(div);
			})
			picreader.readAsDataURL(files[i]);
		}
	}else{
		alert("your browser does not support file Api")
	}
})
