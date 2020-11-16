<?php
    if (!count($_POST)) exit('Ошибка запроса!');

    function send($j) {
        $data = array('success' => false, 'id' => 0, 'msg' => "Книга под номером `$j` уже существует!");
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
            send();
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
        send();
    }

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib');

    if (ctype_digit($count) && $count > 1) {
        if ($count > 500) {
            send();
        }

    	$group  = mysqli_fetch_assoc(mysqli_query($mysql, "SELECT MAX(`Group_ID`) as `group` FROM `books`"))['group'] + 1;
        $groups = [];
        $book_1 = filter_input(INPUT_POST, 'book_1');

        for ($i=1; $i<$count+1; $i++){
            $j = filter_input(INPUT_POST, "book_$i");
            if (!$j) $j = $book_1 + $i - 1;
            if (!ctype_digit($j) || mysqli_fetch_assoc(mysqli_query($mysql, "SELECT COUNT(`ID`) as `id` FROM `books` WHERE `Inventory_NO` = '$j'"))['id'] || in_array($j, $groups)) {
                send($j);
            }
            array_push($groups, $j);
        }
    	for ($i=0; $i<$count; $i++) {
            $inv_no = $groups[$i];
    		mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`, `Group_ID`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no', '$group')");
    	}
    } else {
        if (mysqli_fetch_assoc(mysqli_query($mysql, "SELECT COUNT(`ID`) as `id` FROM `books` WHERE `Inventory_NO` = '$inv_no'"))['id']) {
            send($inv_no);
        }
    	mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no')");
    }

    $id = mysqli_insert_id($mysql);
    $data['success'] = true;
    $data['id'] = $id;

    $json = json_encode($data);
    exit($json);
?>