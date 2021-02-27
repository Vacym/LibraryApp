function navigation(but){ // Общий контроль кнопок
    // console.log(but);

    if (but.key == "Home" && but.altKey){ // Если это alt + home
        window.location = 'index.html'; // Выполняем переход на главную

    } else if(but.key == "ArrowLeft" && but.altKey){ // Если это alt + left
        window.history.back(); // Выполняем переход назад

    } else if(but.key == "ArrowRight" && but.altKey){ // Если это alt + right
        window.history.forward(); // Выполняем переход вперёд
    }
}


document.addEventListener("keydown", navigation);