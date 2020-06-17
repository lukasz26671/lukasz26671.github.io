class AudioPlayer {
    songs = null;
    streamingMode = true;
    streamingProvider = "https://website-audioprovider.herokuapp.com";
    randomMode = false;
    double = false; //double confirm to go back on random mode

    constructor(volume, streamingMode = false) {
        this.volume = volume;
        this.initStart = new Date();
        this.init = true;
        this.streamingMode = streamingMode;
        this.parseSongs();
    }
    parseSongs() {
        fetch(
            "https://raw.githubusercontent.com/lukasz26671/lukasz26671.github.io/master/songs.json"
        )
            .then((res) => res.json())
            .then((out) => {
                this.songJSON = out;
            })
            .then(() => {
                if (this.streamingMode) {
                    this.ids = this.songJSON.streamingSongs.ID;
                    this.songNames = this.songJSON.streamingSongs.names;
                    this.songAuthors = this.songJSON.streamingSongs.authors;
                } else {
                    this.songNames = this.songJSON.songs.names;
                    this.songAuthors = this.songJSON.songs.authors;
                }
                this.maxLen = this.songNames.length;
                this.resolveReferences();
            })
            .catch((err) => {
                throw err;
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
            this.randomize = document.getElementById("random");
            this.sourceInfoParent = document.getElementsByClassName(
                "controlbuttons"
            )[0];
            this.isPlaying = false;
            this.loop = false;
            this.didInteract = false;

            this.prevbtn.style.cursor = "pointer";
            this.nextbtn.style.cursor = "pointer";
            this.playpausebtn.style.cursor = "pointer";

            if (document.getElementById("audioSrcInfo") == null) {
                let a = document.createElement("p");
                a.id = "audioSrcInfo";
                this.sourceInfo = this.sourceInfoParent.appendChild(a);
            }
            this.sourceInfo.innerHTML = this.streamingMode
                ? "via Youtube"
                : "via Local";
            this.sourceInfo.style.fontSize = "10px";
            g.playbackSource = this.streamingMode ? "via Youtube" : "via Local";

            this.setSourcesInit();
        } catch (err) {
            throw err;
        }
    }
    updateToggles(t) {
        try {
            if (t == "loop") {
                this.loop = !this.loop;
                this.loopBox.style.opacity = this.loop ? "1" : "0.3";
            }
            if (t == "randomize") {
                this.randomMode = !this.randomMode;
                this.randomize.style.opacity = this.randomMode ? "1" : "0.3";
            }
        } catch (error) {
            console.log(error);
        }
    }

    setListeners() {
        if (!g.audioPlayerListenersSet) {
            try {
                this.loopBox.addEventListener("click", () => {
                    this.updateToggles("loop");
                });
                this.randomize.addEventListener("click", () => {
                    this.updateToggles("randomize");
                });
            } catch (err) {
                console.log(err);
            }
            window.addEventListener("click", () => {
                if (!this.didInteract) {
                    this.didInteract = true;
                }
            });

            this.playpausebtn.addEventListener("click", () => {
                this.togglePlay();
                this.updateControls();
            });

            this.audiosource.addEventListener("pause", (_event) => {
                clearTimeout(this.timer);
            });

            this.audiosource.addEventListener("ended", () => {
                if (this.loop) {
                    this.play();
                    return;
                } else {
                    this.controls.nextSong();
                }
            });

            this.audiosource.addEventListener("playing", (_event) => {
                let duration = _event.target.duration;
                this.advance(duration, this.audiosource);
                if (!this.isPlaying) {
                    this.isPlaying = true;
                }
            });
            this.prevbtn.addEventListener("click", this.controls.previousSong);
            this.nextbtn.addEventListener("click", this.controls.nextSong);
            g.audioPlayerListenersSet = true;
        }
    }
    setSourcesInit() {
        if (this.streamingMode) {
            fetch(this.streamingProvider, { method: "GET" }).then((res) => {
                if (!res.ok) {
                    console.log(res);
                    this.init = true;
                    this.reinitialize();
                }
            });
        }

        if (this.init) {
            this.rnd = Math.floor(Math.random() * this.maxLen - 1);
            this.audioindex = this.rnd;

            if (this.streamingMode) {
                this.source = `https://website-audioprovider.herokuapp.com/${
                    this.ids[this.rnd]
                }`;
                this.songName.innerHTML = `${this.songAuthors[this.rnd]} - ${
                    this.songNames[this.rnd]
                }`;
            } else {
                this.source = `https://lukasz26671.github.io/audio/audio${this.rnd}.mp3`;
                this.songName.innerHTML = `${
                    this.songAuthors[this.rnd - 1]
                } - ${this.songNames[this.rnd - 1]}`;
            }
            this.audiosource.src = this.source;

            this.init = false;
            if (!this.reinit) this.setListeners();
            this.finalizeInitialization();
        }
    }
    setSources(i) {
        this.audioindex = i;
        if (this.streamingMode) {
            this.source = `https://website-audioprovider.herokuapp.com/${this.ids[i]}`;
            this.songName.innerHTML = `${this.songAuthors[i]} - ${this.songNames[i]}`;
        } else {
            this.source = `https://lukasz26671.github.io/audio/audio${i}.mp3`;
            this.songName.innerHTML = `${this.songAuthors[i - 1]} - ${
                this.songNames[i - 1]
            }`;
        }
        this.audiosource.src = this.source;
    }
    finalizeInitialization() {
        this.audiosource.volume = this.volume;
        g.audioVolume = this.volume;
        this.initEnd = new Date();
        this.initTime = this.initEnd - this.initStart;

        console.log(`Initialization complete after ${this.initTime} ms`);
    }
    reinitialize() {
        console.warn("Streaming mode unavailable, reverting to local audio");
        this.init = true;
        this.reinit = true;
        this.streamingMode = false;
        this.parseSongs();
    }
    startTimer(duration, element) {
        if (this.percent < 100) {
            this.timer = setTimeout(() => {
                this.advance(duration, element);
            }, 100);
        }
    }
    togglePlay(e) {
        e = e || window.event;
        var btn = e.target;
        if (!this.audiosource.paused) {
            btn.classList.remove("active");
            this.pause();
            this.isPlaying = false;
        } else {
            btn.classList.add("active");
            if (this.didInteract) this.audiosource.src = this.source;
            this.play();
            this.isPlaying = true;
        }
    }
    advance(duration, element) {
        this.progress = document.getElementById("progressbar");
        this.increment = 10 / duration;
        this.percent = Math.min(this.increment * element.currentTime * 10, 100);
        this.progress.style.width = this.percent + "%";
        this.startTimer(duration, element);
    }
    updateControls() {
        switch (this.playpausebtn.innerHTML) {
            case "play_arrow":
                this.playpausebtn.innerHTML = "pause";
                break;
            case "pause":
                this.playpausebtn.innerHTML = "play_arrow";
                break;
        }
    }

    rewindtimer = null;

    controls = {
        previousSong: () => {
            if (this.randomMode) {
                if (this.double == true) {
                    this.double = false;
                    this.audioindex =
                        this.audioindex <= 0
                            ? this.maxLen - 1
                            : this.audioindex - 1;

                    this.setSources(this.audioindex);

                    clearInterval(this.rewindtimer);
                } else {
                    this.setSources(this.audioindex);
                    this.double = true;
                    this.rewindtimer = setInterval(
                        () => (this.double = false),
                        10000
                    );
                }
            } else {
                if (this.audioindex <= this.maxLen) {
                    this.audioindex -= 1;
                    this.setSources(this.audioindex);
                }
                if (this.audioindex <= 0) {
                    this.audioindex = this.maxLen - 1;
                    this.setSources(this.audioindex);
                }
            }
            this.playpausebtn.innerHTML = "pause";

            this.play();
        },
        nextSong: () => {
            if (this.randomMode) {
                this.audioindex = getRandomInt(0, this.maxLen);
                this.setSources(this.audioindex);
            } else {
                if (this.audioindex < this.maxLen) {
                    this.audioindex += 1;
                    this.setSources(this.audioindex);
                }
                if (this.audioindex >= this.maxLen) {
                    this.audioindex = 0;
                    this.setSources(0);
                }
                this.playpausebtn.innerHTML = "pause";
            }
            this.double = false;
            clearInterval(this.rewindtimer);
            this.play();
        },
    };
    play() {
        this.audiosource.play();
    }
    pause() {
        this.audiosource.pause();
    }
}
//It's safe to destroy audioPlayer by simply setting it's reference to null, since listeners won't be set again
var removeAudioPlayer = function (audioPlayer) {
    audioPlayer = null;
};
/*  
    rnd = Math.floor(Math.random() * songnames.length+1);
    num = rnd
    audioindex = rnd
    source = `https://lukasz26671.github.io/audio/audio${rnd}.mp3`
    songname.innerHTML = songauthors[num-1] + "-" + songnames[num-1];
    SetSource(audiosource, rnd)
    audiosource.volume = 0.15;
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let f = Math.floor(Math.random() * (max - min + 1)) + min;
    if (f < 0) f *= -1;
    return f;
}
