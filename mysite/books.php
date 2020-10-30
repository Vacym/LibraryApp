<!-- version 1.0 -->

<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Книга</title>
	
	<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/account.css">
</head>
<body>
	<a class="but" id="home" href="/"></a>

	<?php

		$url_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $url_parts = explode('/', trim($url_path, ' /'));
        $page   = array_shift($url_parts);
        $id     = array_shift($url_parts);
        $choose = array_shift($url_parts);

        if (!ctype_digit($id)){
        	echo '<h1>Такой страницы не существует!</h1>';
            exit();
        }

        $mysql = mysqli_connect('localhost', 'root', '', 'test');
        $q = mysqli_query($mysql, "SELECT * FROM `books` WHERE id = '$id'");
        $book = mysqli_fetch_assoc($q);

        if (is_null($book)){
            echo '<h1>Такой книги не существует!</h1>';
            exit();
        }
        else {

        	$user_id = $book['User_id'];
        	$q = mysqli_query($mysql, "SELECT * FROM `users` WHERE id = '$user_id'");
        	$user = mysqli_fetch_assoc($q);

        	if ($choose == 'edit') {

        		// Редактирование книги
        	}

        	else {

	        	$date = $book['Date_of_issue'];

	        	if (is_null($date)) {
	        		$date = '-';
	        	}

	        	echo '<div class="box">';
	        	echo '<div class="head">';
	        	echo '<nav><a href="/books.php/', $id, '/edit" class="but" id="edit"></a></nav>';
	        	echo '<table class="head_information">';
	        	echo '<tr>';
	        	echo '<td class="td_head">Название: </td>';
	        	echo '<td class="td_value">', $book['Name'], '</td>';
	        	echo '</tr><tr>';
	        	echo '<td class="td_head">Автор: </td>';
	        	echo '<td class="td_value">', $book['Author'], '</td>';
	        	echo '</tr><tr>';
	        	echo '<td class="td_head">Жанр: </td>';
	        	echo '<td class="td_value">', $book['Genre'], '</td>';
	        	echo '</tr><tr>';  
	        	echo '<td class="td_head">Описание: </td>';
	        	echo '<td class="td_value">', $book['Comment'], '</td>';
	        	echo '</tr></table></div>';
	        	echo '<div class="information">';
	        	echo '<nav>';
	        	echo '<a href="#" class="but disabled" id="add_book"></a>';
	        	echo '<a href="#" class="but" id="delate_book"></a>';
	        	echo '</nav>';
	        	echo '<table class="books">';
	        	echo '<tr>';

	        	if (is_null($user)) {
	        		echo '<th class="td_value">Свободна</th></tr>';
	        	}
	        	else {
	        		echo '<th class="td_head">Ученик</th>';
	        		echo '<th class="td_value">', $user['Surname'], ' ', $user['Name'], ' ', $user['Lastname'], ' ';
	        		echo '<span class="class">', $user['Class'], ' ', $user['Letter'], '</span>';
	        		echo '</th></tr><tr>';
	        		echo '<td class="td_head">Дата выдачи: </td>';
	        		echo '<td class="td_value">', $date, '</td>';
	        	}
	        	
	        	echo '</tr></table></div></div>';
        	}
        }
	?>
</body>
	
</html>