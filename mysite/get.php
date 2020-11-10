<!-- version 1.0 release -->

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

    	$mysql = mysqli_connect('localhost', 'root', '', 'Lib');

        if (!$mysql) { 
            echo "Ошибка Подключения";
            exit(); 
        }

        if (!array_key_exists('bk', $_GET) || !array_key_exists('us', $_GET) || !ctype_digit($_GET['bk']) || !ctype_digit($_GET['us'])) {
            echo '<h1>Такой страницы не существует!</h1>';
        	exit();
        }

        $bk = $_GET['bk'];
        $us = $_GET['us'];

        $bk   = mysqli_query($mysql, "SELECT * FROM `books` WHERE `ID` = '$bk' AND `User_id` IS NULL");
        $us   = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$us'");
        $book = mysqli_fetch_assoc($bk);
        $user = mysqli_fetch_assoc($us);

        if (is_null($book) || is_null($user)) {
        	echo '<h1>Такой книги или ученика не существует!</h1>';
            echo '<h2 align="center">Возможно книга занята другим учеником</h2>';
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

        		echo '<h1>Книга успешно добавлена!</h1>';
        	}

        	header("refresh:1;url=/account.php/$id");
        	exit();
        }
    ?>

    <div class="box">
    	<div class="head">
    	   <form action="" method="post">
    	       <table class="head_information">
    	           <tr>
        	           <td class="td_head">Книга: </td>
        	           <td class="td_value"><?php echo $book['Name'] ?>
        	           <div class="little"><?php echo $book['Author'] ?></div>
        	       </td>
        	           <td class="td_edit">
        	               <a href="/search_book.php?im=<?php echo $_GET['us'] ?>" class="but" id="edit"></a>
        	           </td>
        	       </tr>
        	       <tr>
        	           <td class="td_head">Ученик: </td>
        	           <td class="td_value"><?php echo $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname'] ?>
        	               <div class="little"><?php echo $user['Class'], ' ', $user['Letter'] ?></div>
        	           </td>
        	           <td class="td_edit">
        	               <a href="/search_student.php?im=<?php echo $_GET['bk'] ?>" class="but" id="edit"></a>
        	           </td>
        	       </tr>
        	       <tr>
        	           <td class="td_head">Дата: </td>
        	           <td class="td_value"><input type="date" name="date" id="date" value="<?php echo date("Y-m-d") ?>"></td>
        	       </tr>
        	   </table>
        	   <input type="submit" value="Получить">
        	</form>
        </div>
    </div>

</body>

</html>