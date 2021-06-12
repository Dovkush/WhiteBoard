let main=document.querySelector(".board");

zoomIn.addEventListener("click",function(){
 if(scaleLevel<1.7){
     scaleLevel+=0.1
    main.style.transform=`scale(${scaleLevel})`;
 }
})
zoomout.addEventListener("click",function(){
    if(scaleLevel>1.0){
        scaleLevel-=0.1
        main.style.transform=`scale(${scaleLevel})`;
    }
})
