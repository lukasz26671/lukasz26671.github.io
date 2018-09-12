
function Pierwiastkowanie(liczba) {	
	alert("Wybrałeś/aś pierwiastkowanie!");
	
		alert("Uwaga! Na razie maksymalny stopień pierwiastka to 3!");
	stopien = prompt("Wpisz stopień", "stopień");

	liczba = prompt("Wpisz liczbę", "liczba");	
	
	
	if (stopien == 1) {
			alert("Pierwiastek 1 stopnia jest taki sam jak liczba, którą chce się spierwiastkować!");
			return liczba;
			document.getElementById("Dzialanie").innerHTML = "&#8730;" + liczba + " = " + liczba;
	} else if (stopien == 2) {
		
		
		} if (liczba >= 0) {
			Wynik = Math.sqrt(liczba);
			alert(Wynik);
			document.getElementById("Dzialanie").innerHTML = "&#8730;" + liczba + " = " + Wynik;
		} else if (liczba < 0) {
			alert("Pierwiastek kwadratowy nie może być liczbą ujemną!")
			document.getElementById("Dzialanie").innerHTML = "&#8730;" + liczba + " = " + "niemożliwe"
		
	} else if (stopien == 3) {
			Wynik = Math.cbrt(liczba);
			alert(Wynik);
			document.getElementById("Dzialanie").innerHTML = "&#8731;" + liczba + " = " + Wynik;
	} else {
		return null;
		alert(null);
		document.getElementById("Dzialanie").innerHTML = "Nie jest zaimplementowane stopniowanie pierwiastków powyżej stopnia 3!"
	};
	
};

function Potegowanie(liczba, wykladnik) {
	alert("Wybrałeś/aś potęgowanie");
	liczba = prompt("Wpisz liczbę", "liczba");
	wykladnik = prompt("Wpisz wykładnik", "Wykładnik");
	
	Wynik = Math.pow(liczba, wykladnik);
	
	alert(Wynik);
	
	document.getElementById("Dzialanie").innerHTML =  liczba + "^" + wykladnik + " = " + Wynik;
};


