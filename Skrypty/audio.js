
const audiosource = document.getElementById("audiosource");
const playpausebtn = document.getElementById("playpause");
const prevbtn = document.getElementById("prev");
const nextbtn = document.getElementById("next");
const content = document.getElementById("content");
const loopBox = document.getElementById("loop");

let isPlaying = false;
let loop = false;
let didInteract;

window.addEventListener('load', updateLoopBox);

window.addEventListener('click', ()=>{
    if(!didInteract)
        didInteract = true;
});

loopBox.addEventListener('click', toggleLoop)

function toggleLoop() {
    loop = !loop;
    updateLoopBox(loop)
}

function updateLoopBox(v) {
    if(v == true){
        loopBox.innerHTML = "loop = T"        
    }
    else if(v == false) {
        loopBox.innerHTML = "loop = F"
    }
}

//#region soundcontrols
let song2;
function NextSong() {
    try{
        if(audioindex < songnames.length){
            SetSource(audiosource, audioindex+1);
        }    
        if(audioindex == songnames.length+1) {
            SetSource(audiosource, 1);
        }

        if(audioindex == 0) {
            SetSource(audiosource, 1);
        }
        songname.innerHTML = songauthors[audioindex-1] + "-" + songnames[audioindex-1];
        audiosource.play();
    }
    catch(error) {
        Console.log(error);   
    }
}
function PreviousSong() {
    if(audioindex > 0) {
        SetSource(audiosource, audioindex-1);
        songname.innerHTML = songauthors[audioindex-1] + "-" + songnames[audioindex-1];
    }

    if(audioindex == 0) {
        SetSource(audiosource, songnames.length);
        audioindex = songnames.length;
        songname.innerHTML = songauthors[audioindex-1] + "-" + songnames[audioindex-1];

    }
    audiosource.play();
}
//#endregion
//#region eventlisteners
audiosource.addEventListener('ended', ()=>{
        if(loop) {SetSource(audiosource, audioindex); audiosource.play(); return;}
        else {NextSong();}
});

playpausebtn.addEventListener('click', ()=>{
    togglePlay();
    if(isPlaying) {
        playpausebtn.innerHTML = "pause";
    } else {
        playpausebtn.innerHTML = "play_arrow";
    }
});
prevbtn.addEventListener('click', PreviousSong);;
nextbtn.addEventListener('click', NextSong);
//#endregion
//#region musicprogressbar
let timer;
let percent = 0;
audiosource.addEventListener("playing", function(_event) {
  let duration = _event.target.duration;
  advance(duration, audiosource);
});
audiosource.addEventListener("pause", function(_event) {
  clearTimeout(timer);
});
const advance = function(duration, element) {
  const progress = document.getElementById("progressbar");
  increment = 10/duration
  percent = Math.min(increment * element.currentTime * 10, 100);
  progress.style.width = percent+'%'
  startTimer(duration, element);
}
const startTimer = function(duration, element){ 
  if(percent < 100) {
    timer = setTimeout(function (){advance(duration, element)}, 100);
  }
}

function togglePlay (e) {
  e = e || window.event;
  var btn = e.target;
  if (!audiosource.paused) {
    btn.classList.remove('active');
    audiosource.pause();
    isPlaying = false;
  } else {
    btn.classList.add('active');
    if(didInteract)
        audiosource.src = source;
        audiosource.play();
    isPlaying = true;
  }
}
//#endregion

audiosource.volume = 0.06;
