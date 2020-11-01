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

        function is_ok($x) { return array_key_exists($x, $_GET); }

        if (is_ok('q')) {
            $q = $_GET['q'];
        } else {
            $q = '';
        }

        if (is_ok('order') && $_GET['order'] == 'author') {
            $order = $_GET['order'];
        } else {
            $order = 'name';
        }

        if (is_ok('im') && ctype_digit($_GET['im'])) {
            $im = $_GET['im'];
        } else {
            $im = '';
        }

        if (is_ok('del') && $_GET['del'] == '1') {
            $del = true;
        } else {
            $del = false;
        }

        echo '<div class="find_input">';
        echo '<form action="" method="get">';

        echo '<input type="search" name="q" id="input" autocomplete="off" autofocus>';
        echo '<input type="hidden" name="order" value=',$order,'>';

        if ($im && $del) {
            echo '<input type="hidden" name="del" value=1>';
            $query = "SELECT * FROM `books` WHERE `$order` LIKE '%$q%' AND `User_id` = '$im' ORDER BY `User_id`";
        } else if ($im) {
            echo '<input type="hidden" name="im" value=',$im,'>';
            $query = "SELECT * FROM `books` WHERE `$order` LIKE '%$q%' ORDER BY `User_id`";
        } else {
            $query = "SELECT * FROM `books` WHERE `$order` LIKE '%$q%'";
        }
        
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
                
        $result = mysqli_query($mysql, $query);
        $bk = mysqli_fetch_assoc($result);

        if (is_null($bk)) {
            echo "Ничего не найдено";
            exit();
        }

        if ($im && $del) {
            $src = '<a class="inline result" href="give.php?us='.$im.'&bk=';
        } else if ($im) {
            $src = '<a class="inline result" href="get.php?us='.$im.'&bk=';
        } else {
            $src = '<a class="inline result" href="books.php/';
        }

        do {
            $id = $bk['User_id'];
            $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
            $user = mysqli_fetch_assoc($res);
            
            echo '<div class="search_result">';

            echo $src, $bk['ID'],'">';
            
            echo '<div class="name">';
            echo '<span class="name_book">',  $bk['Name'],   '</span>';
            echo '<span class="autor_book">', $bk['Author'], '</span>';
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