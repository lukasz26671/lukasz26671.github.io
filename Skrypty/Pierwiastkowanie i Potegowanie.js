function Pierwiastkowanie(liczba) {	
	alert("Wybrałeś/aś pierwiastkowanie!");
	liczba = prompt("Wpisz liczbę", "liczba");
	
	Wynik = Math.sqrt(liczba);
	
	alert(Wynik);
	
	document.getElementById("Dzialanie") = "Pierwiastek kwadratowy z " + liczba + " = " + Wynik;
};

function Potegowanie(liczba, wykladnik) {
	alert("Wybrałeś/aś potęgowanie");
	liczba = prompt("Wpisz liczbę", "liczba");
	wykladnik = prompt("Wpisz wykładnik", "Wykładnik");
	
	Wynik = Math.pow(liczba, wykladnik);
	
	alert(Wynik);
	
	document.getElementById("Dzialanie") =  liczba + "^" + wykladnik + " = " + Wynik;
};