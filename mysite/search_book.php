<!-- version 1.0 release -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Поиск книги</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/search.css">
</head>

<body>
	<a class="but" id="home" href="/"></a>

    <?php

        $mysql = mysqli_connect('localhost', 'root', '', 'test');

        if (!$mysql) {
            exit('Ошибка Подключения'); 
        }

        function is_ok($x) { return array_key_exists($x, $_GET); }

        $arr = array('author', 'genre');

        $q     = is_ok('q') ? $_GET['q'] : '';
        $im    = is_ok('im') && ctype_digit($_GET['im']) ? $_GET['im'] : '';
        $del   = is_ok('del') && $_GET['del'] == '1';
        $order = is_ok('order') && in_array($_GET['order'], $arr) ? $_GET['order'] : 'name';

        echo '<div class="find_input">';
        echo '<form action="" method="GET">';
        echo "<input type='search' name='q' value='$q' id='input' autocomplete='off' autofocus>";
        echo '<select name="order">';

        $arr = array('name' => 'Название', 'author' => 'Автор', 'genre' => 'Жанр');

        foreach ($arr as $i => $j) {
            if ($i == $order) echo "<option value='$i' selected>$j</option>";
            else              echo "<option value='$i'>$j</option>"; 
        }
        echo '</select>';

        if ($im && $del) {
            echo "<input type='hidden' name='im' value='$im'>";
            echo "<input type='hidden' name='del' value=1>";
            $query = "SELECT * FROM `books` WHERE $order LIKE '%$q%' AND `User_id` = '$im' ORDER BY (`User_id`>0), BINARY(lower($order))";
        } elseif ($im) {
            echo "<input type='hidden' name='im' value='$im'>";
            $query = "SELECT * FROM `books` WHERE $order LIKE '%$q%' ORDER BY (`User_id`>0), BINARY(lower($order))";
        } else {
            $query = "SELECT * FROM `books` WHERE $order LIKE '%$q%' ORDER BY BINARY(lower($order))";
        }
        
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
                
        $result = mysqli_query($mysql, $query);
        $bk     = mysqli_fetch_assoc($result);

        if (is_null($bk)) {
            echo "Ничего не найдено";
            exit();
        }

        if ($im && $del) {
            $src = "<a class='result valid' href='give.php?us=$im&bk=";
        } elseif ($im) {
            $src = "<a class='result valid' href='get.php?us=$im&bk=";
        } else {
            $src = "<a class='result valid' href='books.php/";
        }

        do {
            $id = $bk['User_id'];
            $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
            $user = mysqli_fetch_assoc($res);
            
            echo '<div class="search_result">';

            if ($im && !$del && !is_null($id)) {
            	echo "<a class='result'>";
            } else {
            	echo $src, $bk['ID'],"'>";
            }

            echo '<div class="name">';
            echo "<span class='name_book'>{$bk['Name']}</span>";
            echo "<span class='autor_book'>{$bk['Author']}</span>";
            echo '</div>';
            echo '<div class="status">';

            if (is_null($user)) {
                echo 'Свободна';
            }
            else {
                echo $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname'];
            }
            echo '</div></a></div>';
        } while ($bk = mysqli_fetch_assoc($result));
        
    ?>

</body>
</html>