//Copyright © 2018 lukasz26671
/*
  Skrypt Mnozenia by Lukasz26671 
        (Wersja PL)
 */

function Mnozenie() { //Funkcja mnożenia

    alert("Wybrales/as mnozenie!"); //Powiadomienie o typie działania

    Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartość liczby 1
    Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartość liczby 2

    Wynik = +Liczba1 * +Liczba2; //Zmienna wynik

    alert(Liczba1 + "*" + Liczba2 + "=" + Wynik); //Ostrzeż o wyniku

        document.getElementById("Dzialanie").innerHTML = Liczba1 + " * " + Liczba2 + " = " + Wynik; //Napisz na stronie działanie i wynik

}
