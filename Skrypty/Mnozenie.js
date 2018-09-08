/*
  Skrypt Mnozenia by Lukasz26671 
        (Wersja PL)
 */

function Mnozenie() { //Funkcja mno¿enia

    alert("Wybrales/as mnozenie!"); //Powiadomienie o typie dzia³ania

    Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz wartoœæ liczby 1
    Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz wartoœæ liczby 2

    Wynik = +Liczba1 * +Liczba2; //Zmienna wynik

    alert(Liczba1 + "*" + Liczba2 + "=" + Wynik); //Ostrze¿ o wyniku

        document.getElementById("Dzialanie").innerHTML = Liczba1 + " * " + Liczba2 + " = " + Wynik; //Napisz na stronie dzia³anie i wynik

}