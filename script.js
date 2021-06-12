let board=document.querySelector(".canvas-board");
let tool=board.getContext("2d");
let toolbar=document.querySelector(".tool-bar")
let allTools=document.querySelectorAll(".tool-bar>*");
let pencil=document.querySelector(".pencil");
let penSizeRangeBtn=document.querySelector(".thickness");
let eraserSize=document.querySelectorAll(".thicknesseraser>*")
let eraser=document.querySelector(".eraser");
let colors=document.querySelectorAll(".color");
let penOptions=document.querySelector(".pen-options");
let eraserOptions=document.querySelector(".thicknesseraser");
let ticket=document.querySelector(".ticket");
let uploadPictureBtn=document.querySelector(".picture");
let uploadScreenShotbtn=document.querySelector(".screenshot");
let uploadCamerabtn=document.querySelector(".camera");
let click=document.querySelector(".click");
let imageOpns=document.querySelector(".upload-image");
let imageOpnsContainer=document.querySelector(".imageoptions")
let downloadbtn=document.querySelector(".download");
let zoomIn=document.querySelector(".zoomin");
let zoomout=document.querySelector(".zoomout");
let thickness=document.querySelector(".iconcircle");
let thicknessopn=document.querySelector(".thickness");
let thicknessall=document.querySelectorAll(".thickness>*");
let line=document.querySelector(".line");
let inputcontainer=document.querySelector(".inputboard");
let okBtn=document.querySelector(".ok");
let modal=document.querySelector(".modal");
let boardNameContainer=document.querySelector(".boardname");
let boardName;
let scaleLevel=1.0;


let scaleUp=1;
board.height=window.innerHeight;
board.width=window.innerWidth;
let penColor="black";
let prevColor="";
let penFlag=false;
let pensize=5;
let eraserFlag=false;
let eraserActive=false;
let thickflag=false;
let lineFlag=false;
let uploadimgFlag=false;
let elmnt;
let isDown=false;//this flag to check whether key is down or not
let pathsry = [];
let points = [];
let redopoints=[];
let redopathsry=[];
tool.fillStyle="white";
tool.fillRect(0,0,board.width,board.height);
document.body.addEventListener("keydown",function(e){
  console.log(e);
})
okBtn.addEventListener("click",function(){
  boardName=inputcontainer.value;
 console.log(boardName);
 if(boardName==""){
   alert("Please Enter Board Name");
 }else{
  modal.style.display="none";
  boardNameContainer.textContent=boardName;
 }
})
for(let i=0;i<allTools.length;i++){
    allTools[i].addEventListener("click",function(){
        for(let j=0;j<allTools.length;j++){
            allTools[j].classList.remove("active");
        }
        allTools[i].classList.add("active");
    })
}
eraser.addEventListener("click",function(){
  prevColor=penColor;
  penColor="white";//to erase
   eraserActive=true;
    lineFlag=false;
})
eraser.addEventListener("dblclick",function(){
 if(eraserFlag==false){
  penOptions.style.display="none";
    eraserOptions.style.display="flex";
 }else{
    eraserOptions.style.display="none";
 }
   eraserFlag=!eraserFlag;
  })
 
pencil.addEventListener("click",function(){//this will display the options of pen color,size etc
  lineFlag=false;
 
  if(eraserActive==true){
      penColor="black";
      pensize=5;
     
      eraserActive=false;
      eraserOptions.style.display="none";
  }else{
    if(penFlag==false){
      uploadimgFlag=false;
      document.querySelector(".imageoptions").style.display="none";
        penOptions.style.display="block";
       }else{
        penOptions.style.display="none";
       }
        penFlag=!penFlag;
  }
  
      
  })
  //this function will give us the x,y position of mouse point 
  
function getMousePostion(board,event){
    let rect=board.getBoundingClientRect();
    let x=(event.clientX-rect.left)/scaleLevel;
    let y=(event.clientY-rect.top)/scaleLevel;
    return {x,y};
    

}

board.addEventListener("mousedown",function(e){
    let{x,y}=getMousePostion(board,e);
    tool.strokeStyle=penColor;
    tool.lineWidth=pensize;
    tool.beginPath();
    tool.moveTo(x,y);
    if(eraserActive==false){
      points=[];
      points.push({x:x,y:y,penColor})
    }
   
   // console.log(undoSt.peek());
    isDown=true;//when mouse key is down make it true
})
//when mouse key is down and we want to draw 
board.addEventListener("mousemove",function(e){
   if(isDown&&lineFlag==false){//checking if mouse key is down then only draw
    let{x,y}=getMousePostion(board,e);
    tool.lineTo(x,y);
     tool.stroke();
     if(eraserActive==false){
      points.push({x:x,y:y})
     }
     
   }
    
})
line.addEventListener("click",function(){
  lineFlag=!lineFlag;
  penColor="black"
 
  
})
board.addEventListener("mouseup",function(e){

  if(lineFlag==true){
  let{x,y}=getMousePostion(board,e);
  tool.lineTo(x,y);
  tool.stroke();
  }
  if(eraserActive==false){
    pathsry.push(points);
  }
  
   isDown=false;
})
//this will change the size of pen 
thickness.addEventListener("click",function(){
  if(thickflag==false){
    
      thicknessopn.style.display="flex";
      console.log(1);
  }else{
      thicknessopn.style.display="none";
      console.log(2);
  }
  thickflag=!thickflag;
})
for(let i=0;i<thicknessall.length;i++){
    thicknessall[i].addEventListener("click",function(){
    
      pensize=thicknessall[i].getAttribute("size");
    })
}
//this will change the size of eraser
console.log(eraserSize);
for(let i=0;i<eraserSize.length;i++){
  eraserSize[i].addEventListener("click",function(){
    pensize=eraserSize[i].getAttribute("size");
  })
}
//this will change the color of pen
console.log(colors); 
for(let i=0;i<colors.length;i++){
    colors[i].addEventListener("click",function(e){
      console.log(colors[i].classList[2]);
       penColor= colors[i].classList[2];
    })
}
/****Code for Ticket container*****/
//to create ticket
ticket.addEventListener("click",createTicket);
//create ticket and upload image on it
imageOpns.addEventListener("click",function(){
  document.querySelector(".pen-options").style.display="none";
    if(uploadimgFlag==false){
    penFlag=false;
      imageOpnsContainer.style.display="block";
    }else{
      imageOpnsContainer.style.display="none";
    }
    uploadimgFlag=!uploadimgFlag;
})
uploadPictureBtn.addEventListener("click",function(){
   let file;
   
      let fileInput=document.createElement("input");
      fileInput.type="file";
      fileInput.onchange = function() {
        let filesArray = fileInput.files;
        let fileObj = filesArray[0];
        let fr=new FileReader();
        fr.readAsDataURL(fileObj);
        fr.onload=function(){
          let img= document.createElement("img");
          img.src=`${fr.result}`;
       let div=createTicket();
       
         div.style.height="25rem"
         div.style.width="25rem"
          img.setAttribute("class","ticket-image");
          let ticketData=document.querySelectorAll(".ticket-data");
         // let ticketData=document.querySelector(".ticket-data");
         
          ticketData[ticketData.length-1].appendChild(img);
        }
        
      }
      fileInput.click();
    
        
})
function createTicket(){
    let div= document.createElement("div");
    div.setAttribute("class","ticket-container");
    div.innerHTML=` <div class="head">
    <button class="hide ticket-btn"><i class="fas fa-minus ticketicon"></i></button>
   
   <button class="delete ticket-btn"><i class="fas fa-times ticketicon"></i></button>
 
 </div>
 <div class="ticket-data" contenteditable="true"></div>`;
 document.body.appendChild(div);
 let ticketContainer=document.querySelectorAll(".ticket-container");
 //to delete Ticket
 let deletebtns=document.querySelectorAll(".delete");
   for(let i=0;i<deletebtns.length;i++){
     deletebtns[i].addEventListener("click",function(e){
       console.log(e.target);
      deletebtns[i].parentNode.parentNode.remove();
     })
   }
 //to hide Ticket
 let ticketData=document.querySelectorAll(".ticket-data");
 let allheads=document.querySelectorAll(".head");
 let ticketDataFlag=false;
 let hidebtns=document.querySelectorAll(".hide");
 for(let i=0;i<hidebtns.length;i++){
   hidebtns[i].addEventListener("click",function(e){
    let children=e.currentTarget.parentNode.parentNode.children;
    if(ticketDataFlag==false){
      children[1].style.display="none";
     
   }else{
       children[1].style.display="block";
   }
     ticketDataFlag=!ticketDataFlag;
  
   })
  
 }
 let flag=false;
 for(let i=0;i<allheads.length;i++){
     allheads[i].onmousedown=dragMouseDown;
   }
 
   for(let i=0;i<ticketData.length;i++){
     ticketData[i].addEventListener("click",function(){
       ticketData[i].focus();
     })
   }
  
    return div;
}
  
//to download drawing of our board
downloadbtn.addEventListener("click",function(){
    let a=document.createElement("a");
  // tool.scale(scaleLevel,scaleLevel);
 // tool.fillStyle="white";
 // tool.fillRect(0,0,board.width,board.height);
    let url=board.toDataURL();
    a.href=url;
    a.download="file.jpeg";
    
    a.click();
    a.remove();
})
function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
//console.log(e.currentTarget.parentNode);
  elmnt=e.currentTarget.parentNode;
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.body.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.body.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  // set the element's new position:
  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.body.onmouseup = null;
  document.body.onmousemove = null;
}
uploadScreenShotbtn.addEventListener("click", function () {
  takeImage("Screenshot");
});
uploadCamerabtn.addEventListener("click", function () {
  takeImage("Camera")
})
function takeImage(type) {
  let videoelem = document.querySelector(".screenshotvid");
  var displayMediaOptions = {
      video: {
          cursor: "always",
          resizeMode: "crop-and-scale",
      },
      audio: false,

  };
  let constraints = {
      video: true,
      audio: false,
  }
  let mediaStreamObj;
  let recording = [];
  let captureStream;
  if (type == "Screenshot") {
      captureStream = navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } else if (type == "Camera") {
      captureStream = navigator.mediaDevices.getUserMedia(constraints);
  }

  captureStream.then(function (stream) {
      console.log(1);
      videoelem.srcObject = stream;
      mediaStreamObj = new MediaRecorder(stream);
      console.log(mediaStreamObj);
      mediaStreamObj.ondataavailable = function (e) {
          recording.push(e.data);
      }
      mediaStreamObj.onstop = function (e) {
          /* const blob=new Blob(recording,{type:'video/mp4'});
            const url = window.URL.createObjectURL(blob);
           let a = document.createElement("a");
           a.href = url;
           a.download = "file.mp4";
           a.click();
           a.remove();
           recording=[];*/
      }

      if (type == "Screenshot") {
          console.log(1);
          setTimeout(function () {
              capture();
              stopCapture();
          }, 1000);
      } else if (type == "Camera") {
          document.querySelector(".cameracontainer").style.display = "block";
          document.querySelector(".main").style.display = "none";
          click.addEventListener("click", function () {
              capture();
              stopCapture();
          })
      }
  }).catch(function (err) {
      console.log(err);
  })

  function capture() {
      console.log(1);
      let board = document.createElement("canvas");
      console.log(videoelem.videoHeight)
      board.height = videoelem.videoHeight;
      board.width = videoelem.videoWidth;
      let tool = board.getContext("2d");
      tool.drawImage(videoelem, 0, 0);
      // let a=document.createElement("a");
      let url = board.toDataURL();
      let img = document.createElement("img");
      img.src = url;
      let div = createTicket();
      console.log(div.children[1])
      div.children[1].style.height = "30rem"
      div.children[1].style.width = "60rem"
      img.setAttribute("class", "ticket-image");
      let ticketData = document.querySelectorAll(".ticket-data");
      // let ticketData=document.querySelector(".ticket-data");
      ticketData[ticketData.length - 1].appendChild(img);
  }
  /* a.download="board.png";
a.href=url;
a.click();*/
  function stopCapture(evt) {
      if (type == "Screenshot") {
          let tracks = videoelem.srcObject.getTracks();

          tracks.forEach(track => track.stop());
          videoelem.srcObject = null;
      } else {

          videoelem.srcObject = null;
          document.querySelector(".main").style.display = "block";
          document.querySelector(".cameracontainer").style.display = "none";


      }
  }
}


