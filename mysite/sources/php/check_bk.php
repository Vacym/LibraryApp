<?php
    if (!count($_POST)){
        echo 'А что мы тут делаем?';
        exit();
    }

    $arr = array('name', 'author', 'genre', 'comment');

    foreach ($arr as $i) {
        if (!array_key_exists($i, $_POST)) {
            echo 'Ошибка запроса!';
            exit();
        }
    }

    $name    = $_POST['name'];
    $author  = $_POST['author'];
    $genre   = $_POST['genre'];
    $comment = $_POST['comment'];

    $valid_author  = preg_match("/^[а-я- ]+$/ui", $author);
    $valid_genre   = preg_match("/^[а-я- ]+$/ui", $genre);
    $valid_name    = preg_match("/^([а-яё-]|[\., ])+$/ui", $name);
    $valid_comment = preg_match("/^([а-яё-]|[\., ])+$/ui", $comment);

    if (!$valid_name || !$valid_author || !$valid_genre) {
        echo 'Неправильно введенные данные!';
        exit();
    }

    $mysql = new mysqli('localhost', 'root', '', 'test');
    $mysql->query("INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`) VALUES ('$name', '$author', '$genre', '$comment')");
    $mysql->close();

    echo 'Успешно отправлено';
    exit();
?>