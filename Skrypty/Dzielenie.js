/*
  Skrypt Dzielenia by Lukasz26671 
        (Wersja PL)
 */

function Dzielenie() { //funkcja Dzielenia

    alert("Wybrales/as dzielenie"); //Powiadomienie o typie dzialania

    Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz warto�� liczby 1 (dzielna)
    Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz warto�� liczby 2 (dzielnik)

    if (Liczba2 == 0) { //Je�eli dzielnik jest r�wny 0, wtedy:

        alert("Nie mozna dzielic przez 0!"); //Ostrze� "Nie mo�na dzieli� przez 0!"
        document.getElementById("Dzialanie").innerHTML = "Nie mozna dzielic przez 0!"; //Napisz na stronie "Nie mo�na dzieli� przez 0!"

    } else { //W innym wypadku:

        Wynik = +Liczba1 / +Liczba2; //Zmienna wynik

        alert(+Liczba1 + "/" + Liczba2 + "=" + Wynik); //Ostrze� o wyniku

        document.getElementById("Dzialanie").innerHTML = Liczba1 + " / " + Liczba2 + "=" + Wynik; //Napisz na stronie dzia�anie i wynik
    }

};