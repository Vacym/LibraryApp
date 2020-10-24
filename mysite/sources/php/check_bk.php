<?php
    if (!count($_POST)){
        echo 'А что мы тут делаем?';
    }
    else {
        $name    = $_POST['name'];
        $author  = $_POST['author'];
        $genre   = $_POST['genre'];
        $comment = $_POST['comment'];

        $valid_name    = preg_match("/^[а-я- ]+$/ui", $name);
        $valid_author  = preg_match("/^[а-я- ]+$/ui", $author);
        $valid_genre   = preg_match("/^[а-я- ]+$/ui", $genre);
        $valid_comment = preg_match("/^[а-я- ]+$/ui", $comment);

        if (!$valid_name || !$valid_author || !$valid_genre) {
            echo 'Неправильно введенные данные!';
        }
        else {

            $mysql = new mysqli('localhost', 'root', '', 'test');
            $mysql->query("INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`) VALUES ('$name', '$author', '$genre', '$comment')");
            $mysql->close();

            echo 'Успешно отправлено';
        }
    }
    
    header("refresh:3;url=../../add_book.html");
    exit();
?>