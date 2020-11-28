<?php
    if (!count($_POST)) { echo 'Ошибка запроса!'; exit(); }

    function send() {

        $data = array('success' => false, 'id' => 0);
        $json = json_encode($data);

        echo $json;
        exit();
    }

    $arr = array('firstname', 'surname', 'lastname', 'class', 'letter');

    foreach ($arr as $i) {
        if (!array_key_exists($i, $_POST)) {
            send();
        }
    }

    $firstname = $_POST['firstname'];
    $surname   = $_POST['surname'];
    $lastname  = $_POST['lastname'];
    $class     = $_POST['class'];
    $letter    = $_POST['letter'];

    $valid_name = preg_match("/^[а-я-]+$/ui", $firstname);
    $valid_surn = preg_match("/^[а-я-]+$/ui", $surname);
    $valid_last = preg_match("/^[а-я-]+$/ui", $lastname);
    $valid_clss = preg_match("/^([1-9]|1[01])$/", $class);
    $valid_lttr = preg_match("/^[А-Я]$/u", $letter);

    if (trim($lastname) == "") {
        $valid_last = True;
    }

    if (!$valid_name || !$valid_surn || !$valid_last || !$valid_clss || !$valid_lttr) {
        send();
    }

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib');
    
    mysqli_query($mysql, "INSERT INTO `users` (`Firstname`, `Surname`, `Lastname`, `Class`, `Letter`) VALUES ('$firstname', '$surname', '$lastname', '$class', '$letter')");
    
    $id = mysqli_insert_id($mysql);
    $data['success'] = true;
    $data['id'] = $id;
    
    $json = json_encode($data);
    echo $json;
    exit();
?>