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

        if (is_ok('order')) {
            $order = strtolower($_GET['order']);
        } else {
            $order = 'name';
        }

        if (is_ok('asc') && $_GET['asc'] == 'False') {
            $asc = 'False';
        } else {
            $asc = 'True';
        }

        if (is_ok('im') && ctype_digit($_GET['im'])) {
            $im = $_GET['im'];
        } else {
            $im = '';
        }

        echo '<div class="find_input">';
        echo '<form action="" method="get">';

        echo '<input type="search" name="q" id="input" autocomplete="off">';

        $arr = array('im', 'asc', 'order');
        foreach ($arr as $i) echo '<input type="hidden" name="',$i,'" value=',$$i,'>';
        
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';

        if ($asc == 'True') { 
            $asc = ' ASC';
        }
        else {
            $asc = ' DESC';
        }

        switch ($order) {
            case 'genre':  $order = 'ORDER BY BINARY(lower(`Genre`))'; break;
            case 'author': $order = 'ORDER BY BINARY(lower(`Author`))';break;
            case 'date':   $order = 'ORDER BY `Date_of_issue`';        break;
            default:       $order = 'ORDER BY BINARY(lower(`Name`))';  break;
        }

        $order .= $asc;

        if ($im) {
            $query = "SELECT * FROM `books` WHERE `name` LIKE '%$q%' ORDER BY `Date_of_issue`";
        } else {
            $query = "SELECT * FROM `books` WHERE `name` LIKE '%$q%' ".$order;
        }
                
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
            echo '<span class="name_book">',  $bk['Name'],   '</span>';
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