//Skrypt sterujacy przyciskami by Lukasz26671

/*

Powiadomienia = document.getElementById("Powiadomienia").checked; ----WYŁĄCZONE Z POWODU BRAKU ZASTOSOWANIA

*/
function redirectBack() { //funkcja przekieruj spowrotem do strony 1
  	setTimeout("location.href='index.html';", 50);
};

function redirectMain() { //funkcja przekieruj do strony 2
  	setTimeout("location.href='podstrona.html';", 50);
};

function redirectMain2() { //funkcja przekieruj do strony 3
  	setTimeout("location.href='kalkulator.html';", 50);
};

function redirectMain3() { //funkcja przekieruj do strony 4
  	setTimeout("location.href='podstrona2.html';", 50);
};
