<!-- version 1.1  Такой же говнокод, как и account.php -->

<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Книга</title>
	
	<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/account.css">
    <script src="/sources/js/add.js"></script>
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

        		if (count($_POST)){
			        $name    = $_POST['name'];
			        $author  = $_POST['author'];
			        $genre   = $_POST['genre'];
			        $comment = $_POST['comment'];

			        $valid_author  = preg_match("/^[а-я- ]+$/ui", $author);
			        $valid_genre   = preg_match("/^[а-я- ]+$/ui", $genre);
			        $valid_name    = preg_match("/^([а-яё-]|[\., ])+$/ui", $name);
			        $valid_comment = preg_match("/^([а-яё-]|[\., ])+$/ui", $comment);

			        if (!$valid_name || !$valid_author || !$valid_genre) {
			            echo '<h1>Неправильно введенные данные!</h1>';
			        }
			        else {
			            $mysql = new mysqli('localhost', 'root', '', 'test');
			            $mysql->query("UPDATE `books` SET `Name` = '$name', `Author` = '$author', `Genre` = '$genre', `Comment` = '$comment' WHERE `ID` = '$id'");
			            $mysql->close();

			            echo '<h1>Успешно отправлено</h1>';

			            header("refresh:2;url=/books.php/$id");
	                    exit();
	                }
	            }

        		echo '<div class="box">';
        		echo '<h1>Редактировать книгу</h1>';
        		echo '<nav><a href="/books.php/', $id, '/del_me" class="but" id="del"></a></nav>';
        		echo '<form action="" method="POST">';
        		echo '<div class="line">';
        		echo '<input type="text" name="name" id="name" value="', $book['Name'], '" class="necessary_input" autocomplete="off">';
        		echo '<label for="name">Название</label>';
        		echo '</div>';
        		echo '<div class="line">';
        		echo '<input type="text" name="author" id="author" value="', $book['Author'], '" class="necessary_input" autocomplete="off">';
        		echo '<label for="author">Автор</label>';
        		echo '</div>';
        		echo '<div class="line">';
        		echo '<input type="text" name="genre" id="genre" value="', $book['Genre'], '" autocomplete="off">';
        		echo '<label for="genre">Жанр</label>';
        		echo '</div>';
        		echo '<div class="line">';
        		echo '<textarea type="text" name="comment" id="comment" autocomplete="off">', $book['Comment'],'</textarea>';
			    echo '<label for="comment">Комментарий</label>';
			    echo '</div><div><input type="submit" id="submit" value="Сохранить" disabled></div></div>';  
			    
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
	        	echo '<a href="/books.php/', $id, '/add" class="but disabled" id="add_book"></a>';
	        	echo '<a href="/books.php/', $id, '/del" class="but" id="delate_book"></a>';
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