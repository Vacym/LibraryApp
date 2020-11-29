<?php
	if (!count($_POST)) exit('Ошибка запроса!');

	$arr = array();  

	function is_invalid_num($num) {
		return !preg_match("/^\d+$/", $num); 
	}

	foreach ($_POST as $i => $j) {
		if (is_invalid_num($j)) {
			exit('Ошибка запроса!');
		}
		array_push($arr, $j);
	}

	$arr = implode("','", $arr);

	$mysql = mysqli_connect('localhost', 'root', '', 'Lib');
	$query_1 = "DELETE FROM `users` WHERE `ID` IN ('".$arr."')";
	$query_2 = "UPDATE `books` SET `User_id` = NULL, `Date_of_issue` = NULL WHERE `User_id` IN ('".$arr."')";

	mysqli_query($mysql, $query_1);
	mysqli_query($mysql, $query_2);

	echo "Ученики успешно удалены!";
?>