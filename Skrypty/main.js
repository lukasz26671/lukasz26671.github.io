
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

document.addEventListener('swiped-left', ()=> {
    document.body.classList.add("is-menu-visible");
})

try {
    const calc = document.getElementById("Kalkulator");
    const mods = document.getElementById("MinecraftMody");
    const sources = document.getElementById("Zrodla");
    const contact = document.getElementById("Kontakt");
    
    calc.addEventListener('click', () => r.redirect(r.destinations.calc))
    mods.addEventListener('click', () => r.redirect(r.destinations.mods))
    sources.addEventListener('click', () => r.redirect(r.destinations.sources))
    contact.addEventListener('click', () => r.redirect(r.destinations.contact));
} catch (error) {
    console.log(error);
}

