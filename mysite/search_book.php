<?php

    function filter($name, $choice) { // function for init values from GET-form
        $regex = array('number' => '/^\d+$/', 'search' => '/^(\d|[а-я ]|[\.-])+$/ui');
        return filter_input(INPUT_GET, $name) && preg_match($regex[$choice], $_GET[$name]) ? $_GET[$name]: false;
    }
    
    $q     = filter('q', 'search'); // Init query
    $im    = filter('im', 'number'); // Init user_id
    $del   = filter('del','number'); // Init is_delete_page?
    $group = filter('group', 'number'); // Init is_group_page?
    $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['author', 'genre', 'inventory_no']) ? $_GET['order'] : 'name'; // Init which order you ewant
    $page  = filter('page', 'number'); // Init which books you should send to AJAX

    function add_book($q, $im, $del, $order, $group, $page=0) { // function for adding books

        $mysql = mysqli_connect('localhost', 'root', '', 'Lib'); // Connect to mysql

        if (!$mysql) exit('<h1>Ошибка Подключения</h1>'); // If error, exit

        $query = "SELECT * FROM `books` WHERE $order LIKE '$q%'";

        if ($im && $del) { // Show only busy books
            $query = "$query AND `GROUP_ID` = 0 AND `User_id` = '$im' UNION
                      $query AND `User_id` = '$im' GROUP BY `Group_ID` HAVING `Group_ID` > 0";
        } elseif ($group) { // Show only books for one group
            $query = "$query AND `GROUP_ID` = $group";
        } else { // All books, order by value
            $query = "$query AND `GROUP_ID` = 0 UNION
                      $query GROUP BY `Group_ID` HAVING `Group_ID` > 0";
        }

        if ($order == 'inventory_no') $query .= " ORDER BY (`User_id`>0), $order LIMIT 20 OFFSET $page"; // Sort by number
        else                          $query .= " ORDER BY (`User_id`>0), BINARY(lower($order)) LIMIT 20 OFFSET $page"; // Sort by russian words

        $result = mysqli_query($mysql, $query); // Send query
        $bk     = mysqli_fetch_assoc($result); // Output query

         if (is_null($bk)) { // If books doesn't have...
            if ($page) exit();
            exit("Ничего не найдено");
        } 

        $src = '<a class="result valid "'; // Sources
        if ($im && $del) $src .= "href='give.php?us=$im&bk=";
        elseif ($im)     $src .= "href='get.php?us=$im&bk=";
        else             $src .= "href='books.php/";

        do { // While to adding books
            $gid = $group || $del || ($order == 'inventory_no' && $q) ? '': $bk['Group_ID'];

            if ($gid) { // If this book in group

                $res1 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid'");
                $res2 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid' AND `User_id`");
                $all  = mysqli_fetch_assoc($res1)['g'];
                $busy = mysqli_fetch_assoc($res2)['g'];

                echo "<a class='result valid group' href='search_book.php?q=$q&order=$order&im=$im&del=$del&group=$gid'>";
                echo '<div class="left_part">';
                echo "<div class='information'>$busy/$all</div>";
                echo '<div class="FCS">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo '</div></div></a>';

            } else { // General book without group_id 
                $id = $bk['User_id'];
                $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
                $user = mysqli_fetch_assoc($res);

                if ($im && !$del && !is_null($id)) echo "<a class='result'>";
                else                               echo $src, $bk['ID'],"'>";

                echo '<div class="left_part">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo '</div>';
                echo '<div class="right_part">';
                echo "<div class='information'>{$bk['Inventory_NO']}</div>";
                echo '<div class="FCS">';

                if (is_null($user)) echo 'Свободна'; // If book is freedom
                else                echo $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname']; // If not, show saibi

                echo '</div></div></a>';
            }

        } while ($bk = mysqli_fetch_assoc($result));
        
        echo '</div>';
    }

    if ($page) { // If this is a AJAX query...
        add_book($q, $im, $del, $order, $group, $page);
        exit();
    }
?>

<!-- version 1.1 release -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Поиск книги</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/search.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
    <script src="sources/js/search.js"></script>
</head>

<body>
	<a class="but" id="home" href="/"></a>

    <?php

        if ($group) echo "<h2>Поиск книг по группе №$group</h2>";
        else 	    echo '<h2>Поиск книг</h2>';

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

        if ($group) echo "<input type='hidden' name='group' value='$group'>";
        if ($im)    echo "<input type='hidden' name='im' value='$im'>";
        if ($del)   echo "<input type='hidden' name='del' value=1>";

        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
        echo '<div class="search_result">';

        add_book($q, $im, $del, $order, $group);
    ?>
    <a id="up" class="but hidden"></a>

    <script type="text/javascript">
        $(document).ready(function () {
            var page = 20;
            var book_finish = false;

            $(window).scroll(function () {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 5 && !book_finish) {
                    $.ajax({
                        url: 'search_book.php',
                        method: 'get',
                        dataType: 'html',
                        data: {'q': '<?php echo $q ?>', 'im': '<?php echo $im ?>', 'del': '<?php echo $del ?>', 'order': '<?php echo $order ?>', 'group': '<?php echo $group ?>', 'page': page },
                        success: function(data) {
                            if (data) {
                                $('.search_result').append(data);
                                page += 20;
                            } else {
                                book_finish = true;
                            }   
                        }
                    });
                }
            })
        })
        
    </script>
</body>
</html>