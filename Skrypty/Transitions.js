import {TimelineMax} from 'gsap';

const audiopl = document.getElementById('content');
const tl = new TimelineMax;

tl.fromTo(audiopl, 1, {right:'-100%', right: '0%'})
.fromTo(audiopl, 0.8, {height:'2vh'}, {height:'70px'})
.fromTo(audiopl, 0.4, {opacity: '0.1'}, {opacity:'0.7'})


