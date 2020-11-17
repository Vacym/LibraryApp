<!-- version 1.1 release -->

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

    <h2>Поиск книг</h2>
    <?php

        $mysql = mysqli_connect('localhost', 'root', '', 'Lib');

        if (!$mysql) {
            exit('Ошибка Подключения'); 
        }

        $q     = filter_input(INPUT_GET, 'q');
        $del   = filter_input(INPUT_GET, 'del') && $_GET['del'] == '1';
        $im    = filter_input(INPUT_GET, 'im') && ctype_digit($_GET['im']) ? $_GET['im'] : '';
        $group = filter_input(INPUT_GET, 'group') && ctype_digit($_GET['group']) ? $_GET['group'] : '';
        $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['author', 'genre', 'inventory_no']) ? $_GET['order'] : 'name';

        if (!preg_match('/^(\d|[а-я ]|[\.-])+$/ui', $q)) $q = '';

        echo '<div class="find_input">';
        echo '<form action="" method="GET">';
        echo "<input type='search' name='q' value='$q' id='input' autocomplete='off' autofocus>";
        echo '<select name="order">';

        $arr = array('name' => 'Название', 'author' => 'Автор', 'inventory_no' => 'ID', 'genre' => 'Жанр');

        foreach ($arr as $i => $j) {
            if ($i == $order) echo "<option value='$i' selected>$j</option>";
            else              echo "<option value='$i'>$j</option>"; 
        }
        echo '</select>';

        $query = "SELECT * FROM `books` WHERE $order LIKE '$q%' ";

        if ($group) echo "<input type='hidden' name='group' value='$group'>";
        if ($im)    echo "<input type='hidden' name='im' value='$im'>";
        if ($del)   echo "<input type='hidden' name='del' value=1>";

        if ($group)          { $query .= "AND `Group_ID` = '$group'"; }
        elseif ($im && $del) { $query .= "AND `User_id` = '$im'"; } 

        if ($order == 'inventory_no') $query .= " ORDER BY $order";
        else                          $query .= " ORDER BY (`User_id`>0), BINARY(lower($order))"; 
        
        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
                
        $result = mysqli_query($mysql, $query);
        $bk     = mysqli_fetch_assoc($result);

        if (is_null($bk)) {
            exit("Ничего не найдено");
        }
        $src = '<a class="result valid "'; 

        if ($im && $del) {
            $src .= "href='give.php?us=$im&bk=";
        } elseif ($im) {
            $src .= "href='get.php?us=$im&bk=";
        } else {
            $src .= "href='books.php/";
        }

        $groups = [];
        $c      = 0;

        echo '<div class="search_result">';

        do {
            $gid = $group || $del ? '': $bk['Group_ID'];

            if ($gid && !in_array($gid, $groups) ) {
                $c++;
                $res1 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid'");
                $res2 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid' AND `User_id`");
                $all  = mysqli_fetch_assoc($res1)['g'];
                $busy = mysqli_fetch_assoc($res2)['g'];

                array_push($groups, $gid);
                echo "<a class='result valid group' href='search_book.php?q=$q&order=$order&im=$im&del=$del&group=$gid'>";
                echo '<div class="left_part">';
                echo "<div class='information'>$busy/$all</div>";
                echo '<div class="FCS">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo '</div></div></a>';

            } elseif (!$gid) {
                $c++;
                $id = $bk['User_id'];
                $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
                $user = mysqli_fetch_assoc($res);

                if ($im && !$del && !is_null($id)) {
                    echo "<a class='result'>";
                } else {
                    echo $src, $bk['ID'],"'>";
                }

                echo '<div class="left_part">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo '</div>';
                echo '<div class="right_part">';
                echo "<div class='information'>{$bk['Inventory_NO']}</div>";
                echo '<div class="FCS">';

                if (is_null($user)) {
                    echo 'Свободна';
                }
                else {
                    echo $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname'];
                }
                echo '</div></div></a>';
            }

            if ($c == 100) break;

        } while ($bk = mysqli_fetch_assoc($result));
        
        echo '</div>'
    ?>

</body>
</html>