<?php
    if (!count($_POST)){
        echo 'А что мы тут делаем?';
        exit();
    }

    $firstname = $_POST['firstname'];
    $surname   = $_POST['surname'];
    $lastname  = $_POST['lastname'];
    $class     = $_POST['class'];
    $letter    = $_POST['letter'];

    if (trim($lastname) == "")
        $lastname = "без-отчества";

    $valid_name = preg_match("/^[а-я-]+$/ui", $firstname);
    $valid_surn = preg_match("/^[а-я-]+$/ui", $surname);
    $valid_last = preg_match("/^[а-я-]+$/ui", $lastname);
    $valid_clss = preg_match("/^([1-9]|1[01])$/", $class);
    $valid_lttr = preg_match("/^[А-Я]$/u", $letter);

    if (!$valid_name || !$valid_surn || !$valid_last || !$valid_clss || !$valid_lttr) {
        echo 'Неправильно введенные данные!';
        exit();
    }

    // Нам пока что это не нужно
    //$mysql = new mysqli('localhost', 'root', '', 'test');
    //$mysql->query("INSERT INTO `users` (`Name`, `Surname`, `Lastname`, `Class`, `Letter`) VALUES ('$firstname', '$surname', '$lastname', '$class', '$letter')");
    //$mysql->close();

    echo 'Успешно отправлено (все норм)';
?>