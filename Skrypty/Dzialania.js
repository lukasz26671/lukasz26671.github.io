const wynikDzialania = document.getElementById('Dzialanie');
let mode;
let Wynik;

window.addEventListener('load', ()=>{
	changeCalcType();
});

function changeCalcType() {
	if(confirm("Wybierz typ kalkulatora. Ok = alertowy, Cancel = inputowy")) {
		alert("Wybrales kalukator alertowy");
	} else {
		alert("Wybrales kalkulator inputowy")
	}
}	

function pokazDzialanie(tekst) {
	wynikDzialania.innerHTML = tekst;
}

function Dodawanie() { //Funkcja dodawania

	alert("Wybrales/as dodawanie!"); //Powiadomienie o typie działania

	Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
	Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2
	Wynik = +Liczba1 + +Liczba2; //Zmienna Wynik
	

	alert(`${Liczba1}+${Liczba2}=${Wynik}`); //Ostrzeż o wyniku
		pokazDzialanie(`${Liczba1}+${Liczba2}=${Wynik}`);
}

	function Odejmowanie() { //Funkcja odejmowania

		alert("Wybrales/as odejmowanie!"); //Powiadomienie o typie działania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2

		Wynik = +Liczba1 - +Liczba2; //Zmienna wynik
        
		alert(`${Liczba1}+${Liczba2}=${Wynik}`); //Ostrzeż o wyniku
			pokazDzialanie(`${Liczba1}-${Liczba2}=${Wynik}`);
	}
	
	function Mnozenie() { //Funkcja mnożenia

		alert("Wybrales/as mnozenie!"); //Powiadomienie o typie działania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2

		Wynik = +Liczba1 * +Liczba2; //Zmienna wynik

		alert(`${Liczba1}*${Liczba2}=${Wynik}`); //Ostrzeż o wyniku
			pokazDzialanie(`${Liczba1}*${Liczba2}=${Wynik}`);

	}	
	
	function Dzielenie() { //funkcja Dzielenia

		alert("Wybrales/as dzielenie"); //Powiadomienie o typie dzialania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1 (dzielna)
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2 (dzielnik)

		if (Liczba2 == 0) { //Jeżeli dzielnik jest równy 0, wtedy:

			alert("Nie mozna dzielic przez 0!"); //Ostrzeż "Nie można dzielić przez 0!"
					pokazDzialanie("Nie mozna dzielic przez 0!");


		} else { //W innym wypadku:

			Wynik = +Liczba1 / +Liczba2; //Zmienna wynik

			alert(`${Liczba1}/${Liczba2}=${Wynik}`); //Ostrzeż o wyniku
				pokazDzialanie(`${Liczba1}/${Liczba2}=${Wynik}`);
		}	
	};

	//Copyright © 2018 lukasz26671
function Pierwiastkowanie(liczba) {	
	alert("Wybrałeś/aś pierwiastkowanie!");
	alert("Uwaga! Na razie maksymalny stopień pierwiastka to 3!");

	stopien = prompt("Wpisz stopień", "stopień");
	liczba = prompt("Wpisz liczbę", "liczba");	
	
	if (stopien == 1) {
			alert("Pierwiastek 1 stopnia jest taki sam jak liczba, którą chce się spierwiastkować!");
			document.getElementById("Dzialanie").innerHTML = `&#8730${liczba} = ${liczba}`
			return liczba;
	} else if (stopien == 2) {	
			Wynik = Math.sqrt(liczba);
			alert(Wynik);
			document.getElementById("Dzialanie").innerHTML = `&#8730;${liczba} = ${Wynik}`;			
	} else if (stopien == 3) {
			Wynik = Math.cbrt(liczba);
			alert(Wynik);
			document.getElementById("Dzialanie").innerHTML = `&#8731;${liczba} = ${Wynik}`;
	} else {
		document.getElementById("Dzialanie").innerHTML = "Nie jest zaimplementowane stopniowanie pierwiastków powyżej stopnia 3!"
		return null;
	};
	
};

function Potegowanie(liczba, wykladnik) {
	alert("Wybrałeś/aś potęgowanie");
	liczba = prompt("Wpisz liczbę", "liczba");
	wykladnik = prompt("Wpisz wykładnik", "Wykładnik");
	
	Wynik = Math.pow(liczba, wykladnik);
	
	alert(Wynik);
	
	document.getElementById("Dzialanie").innerHTML =  `${liczba}^${wykladnik} = ${Wynik}`;
};


