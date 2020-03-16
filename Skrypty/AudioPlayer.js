class AudioPlayer {
    songs = null;
    constructor(volume) {
        this.volume = volume;
        this.initStart = new Date();
        this.init = true;
        this.parseSongs();
    }
    parseSongs() {  
        fetch('https://raw.githubusercontent.com/lukasz26671/lukasz26671.github.io/master/songs.json')
        .then(res => res.json())
        .then((out) => {
            this.songJSON = out;
        })
        .then(() => {
            this.songNames = this.songJSON.songs.names;
            this.songAuthors = this.songJSON.songs.authors;
            this.maxLen = this.songNames.length;
            this.resolveReferences();
        })
        .catch(err => { 
            throw err ;
        }); 
    }
    resolveReferences() {
        try {
            this.songName = document.getElementById("song");     
            this.audiosource = document.getElementById("audiosource");
            this.playpausebtn = document.getElementById("playpause");
            this.prevbtn = document.getElementById("prev");
            this.nextbtn = document.getElementById("next");
            this.content = document.getElementById("content");
            this.loopBox = document.getElementById("loop");
            this.isPlaying = false;
            this.loop = false;
            this.didInteract = false;

            this.prevbtn.style.cursor = "pointer";
            this.nextbtn.style.cursor = "pointer";
            this.playpausebtn.style.cursor = "pointer";

            this.setSourcesInit();
        } catch(err) {
            throw err;
        }
    }
    updateLoopBox() {
        this.loop = !this.loop;
        if(this.loop) {
            this.loopBox.innerHTML = "loop = TRUE";
        } else {
            this.loopBox.innerHTML = "loop = FALSE";
        }
    }
    setListeners() {
        this.loopBox.addEventListener('click', ()=>{
            this.updateLoopBox();
        });
        window.addEventListener('click', ()=>{
            if(!this.didInteract) {
                this.didInteract =  true;
            }
        })

        window.addEventListener('load', ()=> {
            this.updateLoopBox();
        })

        this.playpausebtn.addEventListener('click', ()=>{
            this.togglePlay()
            this.updateControls();
        });

        this.audiosource.addEventListener("pause", (_event) => {
            clearTimeout(this.timer);
        });

        audiosource.addEventListener('ended', ()=>{
            if(this.loop) {
                this.play(); 
                return;
            }
            else {
                this.nextSong();
            }
        });

        this.audiosource.addEventListener("playing", (_event) => {
            let duration = _event.target.duration;
            this.advance(duration, this.audiosource);
            if(!this.isPlaying) {
                this.isPlaying = true;
            }
        });
        this.prevbtn.addEventListener('click', this.controls.previousSong);
        this.nextbtn.addEventListener('click', this.controls.nextSong);
    }
    setSourcesInit() {
        if(this.init) {
            this.rnd = Math.floor(Math.random() * this.maxLen+1);
            this.audioindex = this.rnd;

            this.source = `https://lukasz26671.github.io/audio/audio${this.rnd}.mp3`;
            this.audiosource.src = this.source;
            this.songName.innerHTML = `${this.songAuthors[this.rnd-1]} - ${this.songNames[this.rnd-1]}`;

            this.init = false;
            this.setListeners();
            this.finalizeInitialization();
        }
    }
    setSources(i) {
        this.audioindex = i;
        this.source = `https://lukasz26671.github.io/audio/audio${i}.mp3`;
        this.audiosource.src = this.source;
        this.songName.innerHTML = `${this.songAuthors[i-1]} - ${this.songNames[i-1]}`;
    }
    finalizeInitialization() {
        this.audiosource.volume = this.volume;
        this.initEnd = new Date();
        this.initTime = this.initEnd - this.initStart;

        console.log(`Initialization complete after ${this.initTime} ms`);
    }
    startTimer(duration, element) {
        if(this.percent < 100) {
            this.timer = setTimeout(()=>{this.advance(duration, element)}, 100);
        }
    }
    togglePlay(e) {
        e = e || window.event;
        var btn = e.target;
        if (!this.audiosource.paused) {
            btn.classList.remove('active');
            this.pause();
            this.isPlaying = false;
        } else {
            btn.classList.add('active');
            if(this.didInteract)
                this.audiosource.src = this.source;
                this.play();
            this.isPlaying = true;
        }
    }
    advance(duration, element) {
        this.progress = document.getElementById("progressbar");
        this.increment = 10/duration
        this.percent = Math.min(this.increment * element.currentTime * 10, 100);
        this.progress.style.width = this.percent+'%'
        this.startTimer(duration, element);
    }
    updateControls() {
        switch(this.playpausebtn.innerHTML) {
            case "play_arrow":
                this.playpausebtn.innerHTML = "pause";
                break;
            case "pause":
                this.playpausebtn.innerHTML = "play_arrow";
                break;
        }
    }
    controls = {
        previousSong: ()=> {
            if(this.audioindex <= this.maxLen) {
                this.audioindex -=1;
                this.setSources(this.audioindex);
            }
            if(this.audioindex == 0) {
                this.audioindex = this.maxLen;
                this.setSources(this.maxLen);
            }
            this.play();
        },
        nextSong: ()=>{
            if(this.audioindex < this.maxLen) {
                this.audioindex +=1;
                this.setSources(this.audioindex);
            }
            if(this.audioindex >= this.maxLen) {
                this.audioindex = 1;
                this.setSources(1);
            }
            this.play();
        }
    }
    play() {
        this.audiosource.play();
    }
    pause() {
        this.audiosource.pause();
    }
}

            /*rnd = Math.floor(Math.random() * songnames.length+1);
            num = rnd
            audioindex = rnd
            source = `https://lukasz26671.github.io/audio/audio${rnd}.mp3`
            songname.innerHTML = songauthors[num-1] + "-" + songnames[num-1];
            SetSource(audiosource, rnd)
            audiosource.volume = 0.15;*/