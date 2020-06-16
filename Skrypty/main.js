const audioInit = new Promise((resolve, reject) => {
    try {
        resolve(new AudioPlayer(0.15, true));
    } catch (e) {
        reject(e);
    }
}).then((ap) => {
    audioPlayer = ap;
});

const redirectInit = new Promise((resolve, reject) => {
    try {
        resolve(new RedirectHandler());
    } catch (e) {
        reject(e);
    }
}).then((rHandler) => (r = rHandler));

class Global {
    audioPlayerListenersSet = false;
    audioVolume = 0.0;
    playbackSource = "";

    onload = [audioInit, redirectInit];

    constructor() {}
}

window.addEventListener("load", () => {
    // g.onload.forEach((action) => {
    //     if (typeof action != "function") {
    //         console.warn(`${action} is not a function @ g.onload.`);
    //         console.log({ action: "not initialized" });
    //         return;
    //     }
    //     console.log({ action: "Initialized" });
    //     action();
    // });
    Promise.all(g.onload);
});

var g = new Global();
var audioPlayer;
var r;
