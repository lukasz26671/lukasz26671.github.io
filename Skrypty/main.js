
const ytapi = ``;

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

let url = 'https://raw.githubusercontent.com/lukasz26671/lukasz26671.github.io/master/songs.json';

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
  num = songnames.length;
})
.catch(err => { throw err });