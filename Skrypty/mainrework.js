let audioPlayer = new AudioPlayer(0.15, true);

window.addEventListener('load', ()=>{
    setTimeout(()=>{
        audioPlayer.updateLoopBox();
        //all code goes here
    }, 150)
})

