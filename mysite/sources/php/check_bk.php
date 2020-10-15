<?php

    if (!count($_POST)){
        echo 'А что мы тут делаем?';
        exit();
    }

    $name   = $_POST['name'];
    $author = $_POST['author'];
    $year   = $_POST['year'];

    $valid_name   = preg_match("/^[а-я-]+$/ui", $name);
    $valid_author = preg_match("/^[а-я-]+$/ui", $author);
    $valid_year   = preg_match("/^[0-9]+$/", $year);

    if (!$valid_name || !$valid_author || !$valid_year) {
        echo 'Неправильно введенные данные!';
        exit();
    }

    // Нам пока что это не нужно
    //$mysql = new mysqli('localhost', 'root', '', 'test');
    //$mysql->query("INSERT INTO `books` (`Name`, `Author`, `Year`) VALUES ('$name', '$author', '$year')");
    //$mysql->close();

    echo 'Успешно отправлено (все норм)';
?>