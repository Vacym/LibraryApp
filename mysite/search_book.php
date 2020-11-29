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

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib'); // Connect to mysql

    if (!$mysql) exit('<h1>Ошибка Подключения</h1>'); // If error, exit

    function add_book($mysql, $q, $im, $del, $order, $group, $page=0) { // function for adding books

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

        if ($order == 'inventory_no' || $group) $query .= " ORDER BY `Inventory_NO` LIMIT 20 OFFSET $page"; // Sort by number
        else                                    $query .= " ORDER BY (`User_id`>0), BINARY(lower($order)) LIMIT 20 OFFSET $page"; // Sort by russian words

        $result = mysqli_query($mysql, $query); // Send query
        $bk     = mysqli_fetch_assoc($result); // Output query

         if (is_null($bk)) { // If books doesn't have...
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
                $all  = mysqli_fetch_assoc($res1)['g']; // Get count of books
                $busy = mysqli_fetch_assoc($res2)['g']; // Get count of busy books

                echo "<a class='result valid group' href='search_book.php?q=$q&order=$order&im=$im&del=$del&group=$gid'>";
                echo '<div class="left_part">';
                echo "<div class='information'>$busy/$all</div>";
                echo '<div class="FCS">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo '</div></div></a>';

            } else { // General book without group_id 
                $id = $bk['User_id']; // Get user id in book
                $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
                $user = mysqli_fetch_assoc($res); // Get user

                if ($im && !$del && !is_null($id)) echo "<a class='result'>"; // If book isn't busy
                else                               echo $src, $bk['ID'],"'>"; // If book is busy

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
        add_book($mysql, $q, $im, $del, $order, $group, $page);
        exit();
    }
?>
<!-- version 1.1 release -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Поиск книг</title>

    <link rel="stylesheet" type="text/css" href="/sources/style/button.css">
    <link rel="stylesheet" type="text/css" href="/sources/style/search.css">
    <script type="text/javascript" src="sources/js/search.js"></script>
</head>

<body>
	<a class="but" id="home" href="/"></a>  <!-- Button home -->

    <?php
        if ($group) {
            $result = mysqli_query($mysql, "SELECT `Name` FROM `books` WHERE `Group_ID` = $group"); // Send query
            $name   = mysqli_fetch_assoc($result); // Output name of group

            if ($name) {
                echo "<h2>Поиск книг по группе &#171;{$name['Name']}&#187; </h2>"; // Print name of group
            } else {
                echo '<h2>Поиск книг</h2>';   
            }
        } else {
            echo '<h2>Поиск книг</h2>';
        }	    

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

        // If one of this params is exist
        if ($group) echo "<input type='hidden' name='group' value='$group'>";
        if ($im)    echo "<input type='hidden' name='im' value='$im'>";
        if ($del)   echo "<input type='hidden' name='del' value=1>";

        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
        echo '<div class="search_result">';

        // Call function for print first 20 books 
        add_book($mysql, $q, $im, $del, $order, $group);
    ?>
    <a id="up" class="but hidden"></a> <!-- Button Up -->

    <script type="text/javascript">

        var page = 20;
        var allowLoading = true; // Check, if request is free
        var is_end_of_books = false; // Check, if books is finished
        var site = document.documentElement; // All html document
        var list_books = document.querySelector('.search_result'); // Div for all books

        function success(data) {
            if (data != "Ничего не найдено") {
                list_books.innerHTML += data; // Add new 20 books
                page += 20;
            } else {
                is_end_of_books = true;
            }
        }

        function ajax(url) { // Send and Get Ajax-request
            if (!allowLoading) return
            allowLoading = false;

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() { // If request is comeback
                if (request.readyState == 4 && request.status == 200) {
                    var req = request.responseText;
                    success(req);
                    allowLoading = true;
                    console.log("New stack...")
                }
            }

            request.open('GET', url);
            request.setRequestHeader('Content-Type', 'application/x-www-form-url');
            request.send(); // Send ajax request
        }
        
        function ready() {
            if (!is_end_of_books && Math.floor(site.scrollTop + site.clientHeight) + 1 >= site.scrollHeight) {
                var url = `search_book.php?q=<?php echo $q ?>&im=<?php echo $im ?>&del=<?php echo $del ?>&order=<?php echo $order ?>&group=<?php echo $group ?>&page=${page}`;

                ajax(url); // Call Ajax funciton
            }
        }
        document.addEventListener('scroll', ready); // Event for listen your scroll in site
    </script>
</body>
</html>