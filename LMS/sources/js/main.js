// version 1.0 release

function navigation(btn) { // Общий контроль кнопок
    if (btn.key == "Home" && btn.altKey) { // Если это alt + home
        window.location = 'index.html'; // Выполняем переход на главную

    } else if(btn.key == "ArrowLeft" && btn.altKey){ // Если это alt + left
        window.history.back(); // Выполняем переход назад

    } else if(btn.key == "ArrowRight" && btn.altKey){ // Если это alt + right
        window.history.forward(); // Выполняем переход вперёд
    }
}

function validWord(num, dec) {
    return dec[(num % 100 > 4 && num % 100 < 20) ? 2: [2, 0, 1, 1, 1, 2][Math.min(num % 10, 5)]] || '';
}

document.addEventListener("keydown", navigation);