/*
  Skrypt Dodawania by Lukasz26671 
        (Wersja PL)
 */

function Dodawanie() { //Funkcja dodawania

    alert("Wybrales/as dodawanie!"); //Powiadomienie o typie dzia�ania

    Liczba1 = prompt("Wpisz pierwsza liczbe", "Liczba"); //Wpisz warto�� liczby 1
    Liczba2 = prompt("Wpisz druga liczbe", "Liczba"); //Wpisz warto�� liczby 2
    Wynik = +Liczba1 + +Liczba2; //Zmienna Wynik

    alert(Liczba1 + "+" + Liczba2 + "=" + Wynik); //Ostrze� o wyniku

         document.getElementById("Dzialanie").innerHTML = Liczba1 + " + " + Liczba2 + " = " + Wynik; //Napisz na stronie dzia�anie i wynik

}