
	function pokazDzialanie(tekst) {
		var dzialanie = document.getElementById('Dzialanie').innerHTML = tekst;
	}

	function Dodawanie() { //Funkcja dodawania

		alert("Wybrales/as dodawanie!"); //Powiadomienie o typie działania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2
		Wynik = +Liczba1 + +Liczba2; //Zmienna Wynik

		alert(Liczba1 + "+" + Liczba2 + "=" + Wynik); //Ostrzeż o wyniku

			pokazDzialanie(Liczba1 + "+" + Liczba2 + "=" + Wynik);

	}

	function Odejmowanie() { //Funkcja odejmowania

		alert("Wybrales/as odejmowanie!"); //Powiadomienie o typie działania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2

		Wynik = +Liczba1 - +Liczba2; //Zmienna wynik

		alert(Liczba1 + "-" + Liczba2 + "=" + Wynik); //Ostrzeż o wyniku

			pokazDzialanie(Liczba1 + "-" + Liczba2 + "=" + Wynik);
	}
	
	function Mnozenie() { //Funkcja mnożenia

		alert("Wybrales/as mnozenie!"); //Powiadomienie o typie działania

		Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
		Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2

		Wynik = +Liczba1 * +Liczba2; //Zmienna wynik

		alert(Liczba1 + "*" + Liczba2 + "=" + Wynik); //Ostrzeż o wyniku

			pokazDzialanie(Liczba1 + "*" + Liczba2 + "=" + Wynik);

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

			alert(+Liczba1 + "/" + Liczba2 + "=" + Wynik); //Ostrzeż o wyniku

					pokazDzialanie(Liczba1 + "/" + Liczba2 + "=" + Wynik);

		}	
	};

	window.addEventListener('load', ()=>{
		site = "kalkulator";
	})