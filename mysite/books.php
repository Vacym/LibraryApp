<!-- version 1.2  код становится интереснее -->

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
			            mysqli_query($mysql, "UPDATE `books` SET `Name` = '$name', `Author` = '$author', `Genre` = '$genre', `Comment` = '$comment' WHERE `ID` = '$id'");

			            echo '<h1>Успешно отправлено</h1>';

			            header("refresh:2;url=/books.php/$id");
	                    exit();
	                }
	            }

        		echo '<div class="box">';
        		echo '<h1>Редактировать книгу</h1>';
        		echo '<nav><a href="/books.php/', $id, '/del_me" class="but" id="del"></a></nav>';
        		echo '<form action="" method="POST">';

        		$arr = array('name' => 'Название', 'author' => 'Автор', 'genre' => 'Жанр');

        		foreach ($arr as $i => $j) {
        			echo '<div class="line">';
        			echo '<input type="text" name="',$i,'" id="',$i,'" value="',$book[ucfirst($i)],'" class="necessary_input" autocomplete="off">';
        			echo '<label for="name">',$j,'</label></div>';
        		}
        		
        		echo '<div class="line">';
        		echo '<textarea type="text" name="comment" id="comment" autocomplete="off">', $book['Comment'],'</textarea>';
			    echo '<label for="comment">Комментарий</label>';
			    echo '</div><div><input type="submit" id="submit" value="Сохранить" disabled></div></div>';  
			    
        	} else if ($choose == 'delete') {
                
                mysqli_query($mysql, "DELETE FROM `books` WHERE `ID` = '$id'");

                echo '<h1>Успешно удален!</h1>';

                header("refresh:2;url=/");
                exit();

        	else {

	        	$date = $book['Date_of_issue'];

	        	if (is_null($date)) {
	        		$date = '-';
	        	}

	        	echo '<div class="box">';
	        	echo '<div class="head">';
	        	echo '<nav><a href="/books.php/', $id, '/edit" class="but" id="edit"></a></nav>';
	        	echo '<table class="head_information">';
	        	
	        	$arr = array('Name' => 'Название', 'Author' => 'Автор', 'Genre' => 'Жанр', 'Comment' => 'Описание');

	        	foreach ($arr as $i => $j) {
	        		echo '<tr>';
	        		echo '<td class="td_head">',$j,': </td>';
	        		echo '<td class="td_value">',$book[$i], '</td></tr>';
	        	}
	        	echo '</table></div>';
	        	
	        	echo '<div class="information">';
	        	echo '<nav>';
	        	echo '<a href="/search_student.php?im=', $id, '" class="but" id="add_book"></a>';
	        	echo '<a href="/give.php?bk=',$id,'&us=', $book['User_id'],'" class="but" id="delate_book"></a>';
	        	echo '</nav>';
	        	echo '<table class="books">';
	        	echo '<tr>';

	        	if (is_null($user)) {
	        		echo '<th class="td_value">Свободна</th></tr>';
	        	}
	        	else {
	        		echo '<th class="td_head">Ученик</th>';
	        		echo '<th class="td_value">', $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname'], ' ';
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
