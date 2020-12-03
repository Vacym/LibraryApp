<?php
	if (!count($_POST)) exit('Ошибка запроса!');

	$arr_books 	= array();
	$arr_groups = array();

	foreach ($_POST as $i => $j) {
		if (!filter_var($j, FILTER_VALIDATE_INT)) {
			exit("Ошибка запроса! - $j");
		}
		if ($j < 0) array_push($arr_groups, -$j);
		else 		array_push($arr_books, $j);
	}

	$arr_books = implode("','", $arr_books);
	$arr_groups = implode("',", $arr_groups);

	$mysql = mysqli_connect('localhost', 'root', '', 'Lib');

	mysqli_query($mysql, "DELETE FROM `books` WHERE `ID` IN ('".$arr_books."')");
	if ($arr_groups) mysqli_query($mysql, "DELETE FROM `books` WHERE `Group_ID` IN ('".$arr_groups."')");

	exit("Книги успешно удалены!");
?>