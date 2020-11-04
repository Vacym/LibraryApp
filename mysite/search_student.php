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

        $arr = array('firstname', 'lastname', 'class', 'letter');

        $q     = is_ok('q') ? $_GET['q'] : '';
        $im    = is_ok('im') && ctype_digit($_GET['im']) ? $_GET['im'] : '';
        $order = is_ok('order') && in_array($_GET['order'], $arr) ? $_GET['order'] : 'surname';

        echo '<div class="find_input">';
        echo '<form action="" method="GET">';
        echo "<input type='search' name='q' value='$q' id='input' autocomplete='off' autofocus>";
        echo '<select name="order">';

        $arr = array('surname' => 'Фамилия', 'firstname' => 'Имя', 'lastname' => 'Отчество', 'class' => 'Класс');

        foreach ($arr as $i => $j) {
            if ($i == $order) echo "<option value='$i' selected>$j</option>";
            else              echo "<option value='$i'>$j</option>"; 
        }
        echo '</select>';
        
        if ($im) {
            echo "<input type='hidden' name='im' value='$im'>";
        }

        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';

        if ($order == 'class') {
            $sort = 'class';
        } else {
            $sort = "BINARY(lower($order))";
        }

        $query = "SELECT * FROM `users` WHERE $order LIKE '%$q%' ORDER BY ".$sort;
        $result = mysqli_query($mysql, $query);
        $st = mysqli_fetch_assoc($result);

        if (is_null($st)) {
            echo "Ничего не найдено";
            exit();
        }

        if ($im) {
            $src = "<a class='inline result' href='get.php?bk=$im&us=";
        } else {
            $src = "<a class='result' href='/account.php/";
        }

        do {   	
            $id = $st['ID'];
        	$res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");

        	echo '<div class="search_result">';
            echo $src, $id, "'>";
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
        	echo '<div class="FCS">', $st['Surname'], ' ', $st['Firstname'], ' ', $st['Lastname'], '</div>';
        	echo '</div></a></div>';

        } while ($st = mysqli_fetch_assoc($result));
        
    ?>

</body>
</html>