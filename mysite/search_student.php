<!-- version 2.0 -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Найти ученика</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/search.css">
</head>

<body>
    <a class="but" id="home" href="/"></a>

    <?php

        $mysql = mysqli_connect('localhost', 'root', '', 'test');

        if (!$mysql) { 
            echo "Ошибка Подключения";
            exit(); 
        }

        function is_ok($x) { return array_key_exists($x, $_GET); }

        $arr = array('name', 'lastname', 'class', 'letter');

        if (is_ok('q')) {
            $q = $_GET['q'];
        } else {
            $q = '';
        }

        if (is_ok('order') && in_array($_GET['order'], $arr)) {
            $order = $_GET['order'];
        } else {
            $order = 'surname';
        }

        echo '<div class="find_input">';
        echo '<form action="" method="get">';

        echo '<input type="search" name="q" id="input" autocomplete="off" autofocus>';
        echo '<input type="hidden" name="order" value="',$order,'">';
        
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';

        $query = "SELECT * FROM `users` WHERE `$order` LIKE '%$q%'";
        $result = mysqli_query($mysql, $query);
        $st = mysqli_fetch_assoc($result);

        if (is_null($st)) {
            echo "Ничего не найдено";
            exit();
        }

        do {   	
            $id = $st['ID'];
        	$res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");

        	echo '<div class="search_result">';
            echo '<a class="result" href="/account.php/', $id, '">';
            echo '<div class="books">';

			while ($bk = mysqli_fetch_assoc($res)) {
        		echo '<div class="book">';
        		echo '<span class="name_book">', $bk['Name'], '</span>';
        		echo '<span class="autor_book">', $bk['Author'] , '</span>';
        		echo '</div>';
    		}
        	
        	echo '</div>';
        	echo '<div class="student">';
        	echo '<div class="class">', $st['Class'], ' ', $st['Letter'], '</div>';
        	echo '<div class="FCS">';
        	echo $st['Surname'], ' ', $st['Name'], ' ', $st['Lastname'];
        	echo '</div></div>';
        	echo '</a></div>';

        } while ($st = mysqli_fetch_assoc($result));
        
    ?>

</body>
</html>