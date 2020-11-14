<?php
    if (!count($_POST)) { echo 'Ошибка запроса!'; exit(); }

    function send() {
        $data = array('success' => false, 'id' => 0);
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
    $valid_inv_id  = valid('num',  $inv_no);

    if (!$valid_name || !$valid_author || !$valid_genre || !$valid_comment || !$valid_inv_id) {
        send();
    }

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib');

    if (ctype_digit($count) && $count > 1) {
        print_r($_POST);
    	$group = mysqli_fetch_assoc(mysqli_query($mysql, "SELECT MAX(`Group_ID`) as `group` FROM `books`"))['group'] + 1;

    	for ($i=0; $i < $count; $i++) { 
    		mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`, `Group_ID`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no', '$group')");
    		$inv_no++;
    	}
    } else {
    	mysqli_query($mysql, "INSERT INTO `books` (`Name`, `Author`, `Genre`, `Comment`, `Inventory_NO`) VALUES ('$name', '$author', '$genre', '$comment', '$inv_no')");
    }

    $id = mysqli_insert_id($mysql);
    $data['success'] = true;
    $data['id'] = $id;

    $json = json_encode($data);
    exit($json);
?>