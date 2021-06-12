let recordBtn=document.querySelector(".record");
let roundbtn=document.querySelector(".round-btn")
let recordvideoelem=document.querySelector(".recordedvideo"); 
let audiorecordelem=document.querySelector(".audio");
let recordingcontainer=document.querySelector(".recordingContainer");
let playBtn=document.querySelector(".recordplay");
let recordingDownloadBtn=document.querySelector(".recorddownload")
let save=document.querySelector(".recordsave");
let discardBtn=document.querySelector(".discard");
let sample=document.querySelector(".sample");
let recordingDBObj=indexedDB.open("Recordings");
let databaseBtn=document.querySelector(".database");
let mediaContainer=document.querySelector(".media_container");
let dataBaseContainer=document.querySelector(".recordingDBcontainer");
let backBtn=document.querySelector(".back");
let recordingDB;
let recplayFlag=false;
let fullscreenFlag=false;
let recordFlag=false;
let audiorecorder;
let videorecorder;
let playFlag=false;
let videoUrl;
let audioUrl;

recordBtn.addEventListener("click",function(){
      if(recordFlag==false){
         recordScreen();
       console.log(boardNameContainer.textContent);
      }else{
         videorecorder.stop();
         audiorecorder.stop();
         roundbtn.classList.remove("record-animation")
      }
      recordFlag=!recordFlag;
})
async function recordScreen(){
 let audiocompleteBlob;
 let videocompleteBlob;
   let stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }  });
        const audiostream=await navigator.mediaDevices.getUserMedia({audio:true});
        roundbtn.classList.add("record-animation");
        let audiochunks=[];
          let chunks=[];
        videorecorder = new MediaRecorder(stream);
       audiorecorder=new MediaRecorder(audiostream);
      audiorecorder.ondataavailable = e => audiochunks.push(e.data);
      audiorecorder.onstop = e => {
         audiocompleteBlob = new Blob(audiochunks, { type: audiochunks[0].type });
        audioUrl= window.URL.createObjectURL(audiocompleteBlob);
        audiorecordelem.src =audioUrl
      };
      videorecorder.start();
     audiorecorder.start();
      //video.srcObject=stream;
      videorecorder.ondataavailable = e => chunks.push(e.data);
      videorecorder.onstop = e => {
        videocompleteBlob = new Blob(chunks, { type: chunks[0].type });
        videoUrl=window.URL.createObjectURL(videocompleteBlob);
        recordvideoelem.src= videoUrl;
        recordingcontainer.style.display="block";
      }
      recordingDownloadBtn.addEventListener("click",function(){
        let a=document.createElement("a");
       
        a.download=`${boardNameContainer.textContent}RecordingVideo.mp4`;
        a.href=videoUrl;
        a.click();
        a.download=`${boardNameContainer.textContent}Recordingaudio.mp4`;
        a.href= audioUrl;
        a.click();
      })
      save.addEventListener("click",function(){
        console.log(audiocompleteBlob);
        console.log(videocompleteBlob)
        addRecordingToDb(boardNameContainer.textContent,audiocompleteBlob,videocompleteBlob)
      })
      discardBtn.addEventListener("click",function(){
        recordingcontainer.style.display="none";
        stream=null;
      })
}
playBtn.addEventListener("click",function(){
  
  if(playFlag==false){
    console.log(1);
    recordvideoelem.play();
    audiorecordelem.play();
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");
  }else{
    console.log(2);
    recordvideoelem.pause();
    audiorecordelem.pause();
    playBtn.classList.add("fa-play");
    playBtn.classList.remove("fa-pause");
  }
 playFlag=!playFlag;
});


recordingDBObj.addEventListener("upgradeneeded",function(){
    recordingDB=recordingDBObj.result;
    recordingDB.createObjectStore("recordings",{keyPath:"rId"});
   // alert("upgradeneeded");
});
recordingDBObj.addEventListener("success",function(){
    recordingDB=recordingDBObj.result;
  //  alert("success");
});
recordingDBObj.addEventListener("error",function(){
  //  alert("error");
});
console.log(boardName);
function addRecordingToDb(name,audioblob,videoblob){
    let tx=recordingDB.transaction("recordings","readwrite");
    let recordingsStore=tx.objectStore("recordings");
    recordingsStore.put({rId:Date.now(),boardName:name,audioblob,videoblob});
}
databaseBtn.addEventListener("click",function(){
    modal.style.display="none";
    toolbar.style.display="none";
    mediaContainer.style.display="none";
    document.querySelector(".main").style.display="none";
    dataBaseContainer.style.display="flex";
    document.querySelector(".recordingContainer").style.display="none";
    let dbrecordings=document.querySelectorAll(".dbrecording");
    for(let i=0;i<dbrecordings.length;i++){
        dbrecordings[i].remove();
    }
    displayRecordings();
    
})
backBtn.addEventListener("click",function(){
   console.log(boardName);
    if(boardName==undefined){
        modal.style.display="block";
    }
    toolbar.style.display="block";
    mediaContainer.style.display="block";
    dataBaseContainer.style.display="none";
    document.querySelector(".main").style.display="block";
   
})
function displayRecordings(){
    let tx=recordingDB.transaction("recordings","readonly");
    let recordingsStore=tx.objectStore("recordings");
    let pendingMedia=recordingsStore.openCursor();
    
    pendingMedia.addEventListener("success",function(){
      
        let cursor=pendingMedia.result;
        if(cursor){
            console.log(cursor.value);
            let dbRecordingdiv=document.createElement("div");
            dbRecordingdiv.setAttribute("class","dbrecording");
           // dbRecordingdiv.setAttribute("id",`${cursor.value.rId}`);
            dataBaseContainer.appendChild(dbRecordingdiv);
           
            let vidContainer=document.createElement("div");
            vidContainer.setAttribute("class","videocontainer");
            dbRecordingdiv.appendChild(vidContainer);
            let vid=document.createElement("video");
            vid.setAttribute("class","recordingfromdb");
             vid.src=window.URL.createObjectURL(cursor.value.videoblob); 
           // vid.controls=true;
           // vid.autoplay=true;
             vidContainer.appendChild(vid);
             let audio=document.createElement("audio");
             audio.src=window.URL.createObjectURL(cursor.value.audioblob);
             audio.setAttribute("class","dbaudio");
            // audio.controls=true;
            // audio.autoplay=true;
           vidContainer.appendChild(audio);
            let optioncontainer=document.createElement("div");
            optioncontainer.setAttribute("class","optioncontainer");
            optioncontainer.setAttribute("id",`${cursor.value.rId}`);
            optioncontainer.innerHTML=`<i class="fas fa-play icon" id="play" style="color: white;"></i>
            <!--<i class="fas fa-pause icon"></i>-->  
              <i class="fas fa-download icon dbrecorddwnld" name=${cursor.value.boardName} " id="download" style="color: white;"></i>
              <i class="fas fa-trash-alt icon" id="delete" style="color: white;"></i>
              <i class="fas fa-expand icon" id="fullscreen" style="color: white;"></i>
              <i class="dbrecBoardName">${cursor.value.boardName}</i>`
             dbRecordingdiv.appendChild(optioncontainer);
             cursor.continue();
        }else{
            let allOptions=document.querySelectorAll(".optioncontainer>*");
            for(let i=0;i<allOptions.length;i++){
                allOptions[i].addEventListener("click",function(e){
                    let task=allOptions[i].getAttribute("id");
                    let nameOfBoard=allOptions[i].getAttribute("name");
                    let rId=e.target.parentNode.getAttribute("id");
                    let RecMaincont=e.target.parentNode.parentNode;
                    let fullscreenelement=RecMaincont;
                    if(task=="play"){
                      playVideo(RecMaincont,allOptions[i]);
                    }else if(task=="delete"){
                      deleteRecordingFromDB(RecMaincont,rId);
                    }else if(task=="download"){
                        downloadRecordingFromDB(allOptions[i],RecMaincont,nameOfBoard);
                    }else if(task=="fullscreen"){
                      /* if(fullscreenFlag==false){
                        RecMaincont.requestFullscreen();
                        RecMaincont.children[0].children[0].style.height="95vh"
                        allOptions[i].classList.remove("fa-expand");
                        allOptions[i].classList.add("fa-compress-arrows-alt")
                       }else{
                        RecMaincont.msExitFullscreen();
                        RecMaincont.children[0].children[0].style.height="15rem"
                        allOptions[i].classList.add("fa-expand");
                        allOptions[i].classList.remove("fa-compress-arrows-alt")
                       }
                        fullscreenFlag=!fullscreenFlag;*/
                       
                      
                        if (!document.fullscreenElement) {
                          RecMaincont.requestFullscreen();
                          RecMaincont.children[0].children[0].style.height="95vh";
                        } else {
                          if (document.exitFullscreen) {
                            document.exitFullscreen();
                            RecMaincont.children[0].children[0].style.height="15rem";
                          }
                        }
                        
                     // RecMaincont.children[0].children[0].requestFullscreen();
                    }
                })
            }
        }
        
        let alldownloadbtns=document.querySelector(".dbrecorddwnld")
    })
    
}
function playVideo(RecMaincont,playbtn){
    let vidConatainer=RecMaincont.children[0];
    if(recplayFlag==false){
        vidConatainer.children[0].play();
        vidConatainer.children[1].play();
        playbtn.classList.remove("fa-play");
        playbtn.classList.add("fa-pause");
    }else{
        vidConatainer.children[0].pause();
        vidConatainer.children[1].pause();
        playbtn.classList.add("fa-play");
        playbtn.classList.remove("fa-pause");
    }
    recplayFlag=!recplayFlag
}
function downloadRecordingFromDB (downloadbtn,RecMaincont,name){
    letrId=RecMaincont.children[1].getAttribute("id");
    let videoLink=RecMaincont.children[0].children[0].src;
   let audioLink=RecMaincont.children[0].children[1].src;
   let a=document.createElement("a");
   a.download=`${name.trim()}recordingvideo.mp4`;
   a.href=videoLink;
   a.click();
   a.download=`${name.trim()}recordingaudio.mp4`;
   a.href=audioLink;
   a.click();
}
function deleteRecordingFromDB(RecMaincont,rId){
    console.log(rId);
    RecMaincont.remove();
    let tx=recordingDB.transaction("recordings","readwrite");
    let recordingsStore=tx.objectStore("recordings");
    rId=Number(rId);
    recordingsStore.delete(rId);
}
