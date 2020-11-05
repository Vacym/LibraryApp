<!-- version 1.0 release -->

<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Книга</title>
	
	<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/account.css">
    <link rel="stylesheet" type="text/css" href="/sources/style/message.css">
    <script type="text/javascript" src="/sources/js/add.js"></script>
    <script type="text/javascript" src="/sources/js/message.js"></script>
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
            exit('<h1>Такой страницы не существует!</h1>');
        }

        $mysql = mysqli_connect('localhost', 'root', '', 'test');
        $q = mysqli_query($mysql, "SELECT * FROM `books` WHERE id = '$id'");
        $book = mysqli_fetch_assoc($q);

        if (is_null($book)){
            exit('<h1>Такой книги не существует!</h1>');
        }

    	$user_id = $book['User_id'];
    	$q = mysqli_query($mysql, "SELECT * FROM `users` WHERE id = '$user_id'");
    	$user = mysqli_fetch_assoc($q);

    	if ($choose == 'edit') {

    		if (count($_POST)){
		        $name    = $_POST['name'];
		        $author  = $_POST['author'];
		        $genre   = $_POST['genre'];
		        $comment = $_POST['comment'];

		        $valid_genre   = preg_match("/^[а-я- ]+$/ui", $genre);
		        $valid_comment = preg_match("/^([а-яё-]|[\., ])+$/ui", $comment);
		        $valid_author  = preg_match("/^([а-яё-]|[\., ])+$/ui", $author);
		        $valid_name    = preg_match("/^([а-яё-]|[\., ])+$/ui", $name);

		        if (!$valid_name || !$valid_author || !$valid_genre || !($valid_comment || $comment == '')) {
		            echo '<h1>Неправильно введенные данные!</h1>';

		            header("refresh:2;url=/books.php/$id");
		            exit();
		        }

	            mysqli_query($mysql, "UPDATE `books` SET `Name` = '$name', `Author` = '$author', `Genre` = '$genre', `Comment` = '$comment' WHERE `ID` = '$id'");

	            echo '<h1>Книга успешно изменена</h1>';

	            header("refresh:2;url=/books.php/$id");
                exit();
            }

    		echo '<div class="box">';
    		echo '<h1>Редактировать книгу</h1>';
    		echo '<nav><div href="#" class="but" id="del" message="w_del"></div></nav>';
    		echo '<form action="" method="POST">';

            echo '<div class="dark" id="w_del">';
            echo '<div class="alert_window">';
            echo '<div class="alert_message">Вы уверены, что хотите удалить книгу?</div>';
            echo '<div class="sure">';
            echo '<div class="but_window_space">';
            echo "<a class='but_window' href='/books.php/$id/delete'>Удалить</a></div>";
            echo '<div class="but_window_space">';
            echo '<div class="but_window" id="cancel">Отменить</div>';
            echo '</div></div></div></div>';

    		$arr = array('name' => 'Название', 'author' => 'Автор', 'genre' => 'Жанр');

    		foreach ($arr as $i => $j) {
    			echo '<div class="line">';
    			echo "<input type='text' name='$i' id='$i' value='{$book[ucfirst($i)]}' class='necessary_input' autocomplete='off'>";
    			echo "<label for='name'>$j</label></div>";
    		}
    		
    		echo '<div class="line">';
    		echo "<textarea type='text' name='comment' id='comment' autocomplete='off'>{$book['Comment']}</textarea>";
		    echo '<label for="comment">Комментарий</label>';
		    echo '</div><div><input type="submit" id="submit" value="Сохранить" disabled></div></div>';
		    exit(); 
		    
    	} else if ($choose == 'delete') {
                    
            mysqli_query($mysql, "DELETE FROM `books` WHERE `ID` = '$id'");

            echo '<h1>Книга успешно удалена!</h1>';

            header("refresh:2;url=/");
            exit();
    	}

    	echo '<div class="box">';
    	echo '<div class="head">';
    	echo "<nav><a href='/books.php/$id/edit' class='but' id='edit'></a></nav>";
    	echo '<table class="head_information">';
    	
    	$arr = array('Name' => 'Название', 'Author' => 'Автор', 'Genre' => 'Жанр', 'Comment' => 'Описание');

    	foreach ($arr as $i => $j) {
    		echo '<tr>';
    		echo "<td class='td_head'>$j: </td>";
    		echo "<td class='td_value'>$book[$i]</td></tr>";
    	}
    	echo '</table></div>';
    	
    	echo '<div class="information">';
    	echo '<nav>';

    	if (is_null($user_id)) {
    		echo "<a href='/search_student.php?im=$id' class='but' id='add_book'></a>";
    	} else {
			echo "<a href='/give.php?bk=$id&us=$user_id' class='but' id='delate_book'></a>";
    	}
    	
    	echo '</nav>';
    	echo '<table class="books">';
    	echo '<tr>';

    	if (is_null($user)) {
    		echo '<th class="td_value">Свободна</th></tr>';
    		echo '</tr></table></div></div>';
    		exit();
    	}

    	if (is_null($book['Date_of_issue'])) $date = '-';
        else                                 $date = $book['Date_of_issue'];

		echo '<th class="td_head">Ученик</th>';
		echo "<th class='td_value'>{$user['Surname']} {$user['Firstname']} {$user['Lastname']} ";
		echo "<span class='class'>{$user['Class']} {$user['Letter']}</span>";
		echo '</th></tr><tr>';
		echo '<td class="td_head">Дата выдачи: </td>';
		echo "<td class='td_value'>$date</td>";

    	echo '</tr></table></div></div>';
    	exit();
	?>

</body>
	
</html>