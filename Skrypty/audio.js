let json_songs = fetch(url)
let songnames;
let songauthors;

window.addEventListener('load', ()=>{
    json_songs = json_file
})

const audiosource = document.getElementById("audiosource");
const playpausebtn = document.getElementById("playpause");
const prevbtn = document.getElementById("prev");
const nextbtn = document.getElementById("next");
const songname = document.getElementById("song");
const content = document.getElementById("content");
let rnd = Math.floor(Math.random() * songnames.length+1);
let source = `audio/audio${rnd}.mp3` //random src

let audioindex = rnd;
let isPlaying = false;

//#region sourceassign
function JoinSuffix(num) {
    if(num > 0 || num < songnames.length) {
        audioindex = num;
    }
    songname.innerHTML = songauthors[num-1] + "-" + songnames[num-1];
    source = `audio/audio${audioindex}.mp3`;
    return `audio/audio${audioindex}.mp3`;
}

function SetSource(object, num) {

    object.src = JoinSuffix(num);
    setCookie("soundindex", num, 0.01)
       
}

//#endregion

//#region autoplay
    window.addEventListener('click', ()=>{

        let startedYet = false;
        if(!startedYet) {
            togglePlay();
            playpausebtn.innerHTML = "pause";
            startedYet = true;
        }
    })
//#endregion

//#region soundcontrols
let song2;
function NextSong() {
    if(audioindex < songnames.length){
        SetSource(audiosource, audioindex+1);
    }    
    if(audioindex == songnames.length) {
        SetSource(audiosource, 1);
    }

    if(audioindex == 0) {
        SetSource(audiosource, 1);
    }
    songname.innerHTML = songauthors[audioindex-1] + "-" + songnames[audioindex-1];
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
        SetSource(audiosource, songnames.length);
        audioindex = songnames.length;
    }
    songname.innerHTML = songauthors[audioindex-1] + "-" + songnames[audioindex-1];
    audiosource.play();
}
//#endregion
//#region eventlisteners
window.addEventListener('load', ()=>{
    SetSource(audiosource, rnd);
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
    audiosource.play();
    isPlaying = true;
  }
}
//#endregion

audiosource.volume = 0.06;
audiosource.src = source;
audiosource.load();
