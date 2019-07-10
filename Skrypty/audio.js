var songnames = [
"THE SCORE, BLACKBEAR - DREAMIN",  
"THE SCORE - HIGHER", 
"ZAYDE WOLF - WE GOT THE POWER", 
"THE SCORE - MIRACLE",
"ALAN WALKER - ON MY WAY", 
"THE SCORE - UNDER THE PRESSURE",
"Axol & Alban Chela - Psyche (Nightcore)",
"ZAYDE WOLF - COLD BLODED"
];
var audiosource = document.getElementById("audiosource");
var playpausebtn = document.getElementById("playpause");
var prevbtn = document.getElementById("prev");
var nextbtn = document.getElementById("next");
var songname = document.getElementById("song");
var content = document.getElementById("content");
var source = `audio/audio1.mp3` //default src

let audioindex = 1;
let isPlaying = false;

//#region sourceassign
function JoinSuffix(num) {
    if(num > 0 || num < 8) {
        audioindex = num;
    }
    songname.innerHTML = songnames[num-1];
    source = `audio/audio${audioindex}.mp3`;
    return `audio/audio${audioindex}.mp3`;
}

function SetSource(object, num) {

    object.src = JoinSuffix(num);
    setCookie("soundindex", num, 0.01)
       
}
//#endregion
//#region soundcontrols
let song2;
function NextSong() {
    if(audioindex < 8){
        SetSource(audiosource, audioindex+1);
    }    
    if(audioindex == 8) {
        SetSource(audiosource, 1);
    }

    if(audioindex == 0) {
        SetSource(audiosource, 1);
    }
    songname.innerHTML = songnames[audioindex-1];
    audiosource.play();
}
function PreviousSong() {
    if(audioindex > 0) {
        SetSource(audiosource, audioindex-1);
    }

    if(audioindex == 5) {
        song2 = document.createElement("p");
        songname.appendChild(song2);
        song2.innerHTML = "CARPENTER, FARRUKO - ON MY WAY"; 
        content.style.height = "80px";
    } else {
        if(song2!=null){
            song2.innerHTML = ""; 
            songname.parentNode.removeChild(song2);
        }
        content.style.height = "70px";
    }

    if(audioindex == 0) {
        SetSource(audiosource, 8);
        audioindex = 8;
    }
    songname.innerHTML = songnames[audioindex-1];
    audiosource.play();
}
//#endregion
//#region eventlisteners
window.addEventListener('load', ()=>{
    audioindex = 1;
    songname.innerHTML = songnames[0];
});
audiosource.addEventListener('ended', NextSong);

playpausebtn.addEventListener('click', ()=>{
    togglePlay();
    if(isPlaying) {
        playpausebtn.innerHTML = "pause";
    } else {
        playpausebtn.innerHTML = "play_arrow";
    }
});
prevbtn.addEventListener('click', PreviousSong);
nextbtn.addEventListener('click', NextSong);
//#endregion
//#region musicprogressbar
var timer;
var percent = 0;
audiosource.addEventListener("playing", function(_event) {
  var duration = _event.target.duration;
  advance(duration, audiosource);
});
audiosource.addEventListener("pause", function(_event) {
  clearTimeout(timer);
});
var advance = function(duration, element) {
  var progress = document.getElementById("progressbar");
  increment = 10/duration
  percent = Math.min(increment * element.currentTime * 10, 100);
  progress.style.width = percent+'%'
  startTimer(duration, element);
}
var startTimer = function(duration, element){ 
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
    audiosource.play();
    isPlaying = true;
  }
}
//#endregion

audiosource.volume = 0.06;
audiosource.src = source;
audiosource.load();