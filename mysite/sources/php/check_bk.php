<?php
    if (!count($_POST)) { echo 'Ошибка запроса!'; exit(); }

    function send() {

        $data = array('success' => false, 'id' => 0);
        $json = json_encode($data);

        echo $json;
        exit();
    }

    $arr = array('name', 'author', 'genre', 'comment');

    foreach ($arr as $i) {
        if (!array_key_exists($i, $_POST)) {
            send();
        }
    }

    $name    = $_POST['name'];
    $author  = $_POST['author'];
    $genre   = $_POST['genre'];
    $comment = $_POST['comment'];

    $valid_genre   = preg_match("/^[а-я- ]+$/ui", $genre);
    $valid_author  = preg_match("/^([а-яё-]|[\., ])+$/ui", $author);
    $valid_name    = preg_match("/^([а-яё-]|[\., ])+$/ui", $name);
    $valid_comment = preg_match("/^([а-яё-]|[\., ])+$/ui", $comment);

    if (!$valid_name || !$valid_author || !$valid_genre || !($valid_comment || $comment == '')) {
        send();
    }

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib');

    mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`) VALUES ('$name', '$author', '$genre', '$comment')");

    $id = mysqli_insert_id($mysql);
    $data['success'] = true;
    $data['id'] = $id;

    $json = json_encode($data);
    echo $json;
    exit();
?>