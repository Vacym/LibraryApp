// version 1.0 release

function navigation(but){ // Общий контроль кнопок
    if (but.key == "Home" && but.altKey){ // Если это alt + home
        window.location = 'index.html'; // Выполняем переход на главную

    } else if(but.key == "ArrowLeft" && but.altKey){ // Если это alt + left
        window.history.back(); // Выполняем переход назад

    } else if(but.key == "ArrowRight" && but.altKey){ // Если это alt + right
        window.history.forward(); // Выполняем переход вперёд
    }
}

function validWord(num, dec) { //Корректирует слова под нужные окончания
    let i;
    if (num%10 >= 5 || num%10 == 0 || num%100 > 10 && num%100 <= 20) i = 0;
    else if (num%10 >= 2 && num%10 < 5)                              i = 1;
    else                                                             i = 2;
    return dec[i];
}

document.addEventListener("keydown", navigation);