let fullscreenBtn=document.querySelector(".fullscreen");
let liveStreamBtn=document.querySelector(".livecamera");
let liveStreamvideoContainer=document.querySelector(".livestream");

let liveCameraFlag=false;
fullscreenBtn.addEventListener("click",function(){
    document.body.style.backgroundColor="white";
    document.body.requestFullscreen();
})
liveStreamBtn.addEventListener("click",function(){
    if(liveCameraFlag==false){
          liveStreamBtn.children[0].classList.remove("fa-video");
          liveStreamBtn.children[0].classList.add("fa-video-slash");
          liveStreamvideoContainer.style.display="block";
         getCameraAccess()
    }else{
        liveStreamBtn.children[0].classList.add("fa-video");
        liveStreamBtn.children[0].classList.remove("fa-video-slash");
        liveStreamvideoContainer.style.display="none";
        let tracks = liveStreamvideoContainer.srcObject.getTracks();

        tracks.forEach(track => track.stop());
        liveStreamvideoContainer.srcObject = null;
    }
    liveCameraFlag=!liveCameraFlag;
})
//<i class="fas fa-video-slash"></i>
async function getCameraAccess(){
    let camerastream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
         
    liveStreamvideoContainer.srcObject=camerastream;
}