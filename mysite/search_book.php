<!-- version 2.0 -->

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
            echo "Ошибка Подключения";
            exit(); 
        }

        if (!array_key_exists('q', $_GET)) {
            $q = '';
        } else {
            $q = $_GET['q'];
        }

        if (array_key_exists('im', $_GET) && ctype_digit($_GET['im'])) {
            $im = $_GET['im'];
            $query = "SELECT * FROM `books` WHERE `name` LIKE '%$q%' AND `User_id` IS NULL ORDER BY BINARY(lower(`Name`))";
        }
        else {
            $im = '';
            $query = "SELECT * FROM `books` WHERE `name` LIKE '%$q%' ORDER BY BINARY(lower(`Name`))";
        }

        echo '<div class="find_input">';
        echo '<form action="" method="get">';

        if ($im) {
            echo '<input type="hidden" name="im" value=', $im,'>';
        }
        echo '<input type="search" name="q" id="input" autocomplete="off">';
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';   
                
        $result = mysqli_query($mysql, $query);
        $bk = mysqli_fetch_assoc($result);

        if (is_null($bk)) {
            echo "Ничего не найдено";
            exit();
        }

        do {
            $id = $bk['User_id'];
            $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
            $user = mysqli_fetch_assoc($res);
            
            echo '<div class="search_result">';

            if ($im) {
                echo '<a class="inline result" href="get.php?us=', $im, '&bk=', $bk['ID'], '">';
            }
            else {
                echo '<a class="inline result" href="books.php/', $bk['ID'], '">';
            }

            echo '<div class="name">';
            echo '<span class="name_book">', $bk['Name'], '</span>';
            echo '<span class="autor_book">', $bk['Author'], '</span>';
            echo '</div>';
            echo '<div class="status">';

            if (is_null($user)) {
                echo 'Свободна';
            }
            else {
                echo $user['Surname'], ' ', $user['Name'], ' ', $user['Lastname'];
            }
            echo '</div></a></div>';
        } while ($bk = mysqli_fetch_assoc($result));
        
    ?>

</body>
</html>