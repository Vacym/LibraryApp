<?php
    if (!count($_POST)) exit('Ошибка запроса!');

    function send($msg) {
        $data = array('success' => false, 'id' => 0, 'msg' => $msg);
        $json = json_encode($data);

        exit($json);
    }

    function valid($i, $value) {
    	$re = array('name' => '/^([а-яё-]|[\., ])+$/ui', 'num' => "/^\d+$/");
    	return preg_match($re[$i], $value);
    }

    $arr = array('name', 'author', 'genre', 'comment', 'id', 'count');

    foreach ($arr as $i) {
        if (!array_key_exists($i, $_POST)) {
            send("Ошибка создания книг!");
        }
    }

    $name    = $_POST['name'];
    $author  = $_POST['author'];
    $genre   = $_POST['genre'];
    $comment = $_POST['comment'];
    $inv_no  = $_POST['id'];
    $count	 = $_POST['count'];

    $valid_genre   = valid('name', $genre);
    $valid_author  = valid('name', $author);
    $valid_name    = valid('name', $name);
    $valid_comment = valid('name', $comment) || $comment == '';
    $valid_inv_no  = valid('num',  $inv_no);

    if (!$valid_name || !$valid_author || !$valid_genre || !$valid_comment || !$valid_inv_no) {
        send("Некоректный ввод");
    }

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib');

    if (ctype_digit($count) && $count > 1) {
        if ($count > 500) {
            send("Невозможно создать группу с более 500 книгами!");
        }

    	$group  = mysqli_fetch_assoc(mysqli_query($mysql, "SELECT MAX(`Group_ID`) as `group` FROM `books`"))['group'] + 1;
        $groups = [];

        for ($i=1; $i<$count+1; $i++){
            $j = filter_input(INPUT_POST, "book_$i");
            if (!$j) $j = $groups[$i-2] + 1;
            if (!valid('num', $j)) {
                send("В $i-ой книге допущена ошибка в написании числа");
            }
            elseif (mysqli_fetch_assoc(mysqli_query($mysql, "SELECT COUNT(`ID`) as `id` FROM `books` WHERE `Inventory_NO` = '$j'"))['id']) {
            	send("Книга под номером `$j` уже существует!");
            }
            elseif (in_array($j, $groups)) {
            	send("Книга под номером `$j` уже записана в эту группу!");
            }
            array_push($groups, $j);
        }
    	for ($i=0; $i<$count; $i++) {
            $inv_no = $groups[$i];
    		mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`, `Group_ID`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no', '$group')");
    	}
    } else {
        if (mysqli_fetch_assoc(mysqli_query($mysql, "SELECT COUNT(`ID`) as `id` FROM `books` WHERE `Inventory_NO` = '$inv_no'"))['id']) {
            send("Книга под номером `$inv_no` уже существует!");
        }
    	mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no')");
    }

    $id = mysqli_insert_id($mysql);
    $data['success'] = true;
    $data['id'] = $id;

    $json = json_encode($data);
    exit($json);
?>