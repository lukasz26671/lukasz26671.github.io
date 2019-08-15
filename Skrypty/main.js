let url = 'https://raw.githubusercontent.com/lukasz26671/lukasz26671.github.io/master/songs.json';
const songname = document.getElementById("song");

const ytapi = ``;

let songnames;
let songauthors;
let rnd;
let num
let source; //random src
let audioindex;

let json_songs = fetch(url)

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//#region sourceassign
function JoinSuffix(num) {
  if(num > 0 || num < 21) {
      audioindex = num;
  }
  source = `audio/audio${audioindex}.mp3`;
  return `audio/audio${audioindex}.mp3`;
}

//#endregion

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  
}

function checkCookie(cname) {

  var cookie = getCookie(cname)
  if(cookie != null || cookie != "") {
    return true;
  } else {
    return false;
  }

}


function SetSource(object, num) {

  object.src = JoinSuffix(num);
  setCookie("soundindex", num, 0.01)
     
}


let json_file;
fetch(url)
.then(res => res.json())
.then((out) => {
  console.log('Checkout this JSON! ', out);
  json_file = out;
})
.then(() => {
  songnames = json_file.songs.names;
  songauthors = json_file.songs.authors;
  rnd = Math.floor(Math.random() * songnames.length+1);
  num = rnd
  audioindex = rnd
  source = `audio/audio${rnd}.mp3`
  songname.innerHTML = songauthors[num-1] + "-" + songnames[num-1];
  SetSource(audiosource, rnd)
  audiosource.volume = 0.1;
})
.catch(err => { throw err });

