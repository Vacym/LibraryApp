<!-- version 1.0 -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Книга</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" href="/sources/style/get.css">
</head>

<body>
    <a class="but" id="home" href="/"></a>

    <?php

    	$mysql = mysqli_connect('localhost', 'root', '', 'test');

        if (!$mysql) { 
            echo "Ошибка Подключения";
            exit(); 
        }	

        $bk = $_GET['bk'];
        $us = $_GET['us'];

        if (!ctype_digit($bk) || !ctype_digit($us)) {
        	echo '<h1>Такой страницы не существует!</h1>';
        	exit();
        }

        $bk   = mysqli_query($mysql, "SELECT * FROM `books` WHERE `ID` = '$bk'");
        $us   = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$us'");
        $book = mysqli_fetch_assoc($bk);
        $user = mysqli_fetch_assoc($us);

        if (is_null($book) || is_null($user)) {
        	echo '<h1>Такой книги или ученика не существует!</h1>';
        	exit();
        }

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
        	$id    = $_GET['us'];
        	$bk    = $_GET['bk'];
        	$date  = $_POST['date'];

        	$is_valid = preg_match("/^\d{4}-\d{2}-\d{2}$/", $date);

        	if (!$is_valid) {
        		echo '<h1>Неправильно введенные данные!</h1>';
        	}
        	else {

        		$query = mysqli_query($mysql, "UPDATE `books` SET `User_id` = '$id', `Date_of_issue` = '$date' WHERE `ID` = '$bk'");

        		echo '<h1>Успешно отправлено!</h1>';
        	}

        	header("refresh:2;url=/account.php/$id");
        	exit();
        }

    	echo '<div class="box">';
    	echo '<div class="head">';
    	echo '<form action="" method="post">';
    	echo '<table class="head_information">';
    	echo '<tr>';
    	echo '<td class="td_head">Книга: </td>';
    	echo '<td class="td_value">', $book['Name'];
    	echo '<div class="little">', $book['Author'], '</div>';
    	echo '</td>';
    	echo '<td class="td_edit">';
    	echo '<a href="/get.php/edit" class="but" id="edit"></a>';
    	echo '</td>';
    	echo '</tr>';
    	echo '<tr>';
    	echo '<td class="td_head">Ученик: </td>';
    	echo '<td class="td_value">', $user['Surname'], ' ', $user['Name'], ' ', $user['Lastname'];
    	echo '<div class="little">', $user['Class'], ' ', $user['Letter'], '</div>';
    	echo '</td>';
    	echo '<td class="td_edit">';
    	echo '<a href="get_book.html" class="but" id="edit"></a>';
    	echo '</td>';
    	echo '</tr>';
    	echo '<tr>';
    	echo '<td class="td_head">Дата: </td>';
    	echo '<td class="td_value"><input type="date" name="date" id="date" value="', date("Y-m-d"),'"></td>';
    	echo '</tr>';
    	echo '</table>';
    	echo '<input type="submit" value="Добавить">';
    	echo '</form></div></div>';

    ?>

</body>

</html>