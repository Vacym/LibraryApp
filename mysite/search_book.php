<?php

    function filter($name, $choice) { // function for init values from GET-form
        $regex = array('number' => '/^\d+$/', 'search' => '/^(\d|[а-я ]|[\.-])+$/ui');
        return filter_input(INPUT_GET, $name) && preg_match($regex[$choice], $_GET[$name]) ? $_GET[$name]: false;
    }
    
    $q     = filter('q', 'search'); // Init query
    $im    = filter('im', 'number'); // Init user_id
    $del   = filter('del','number'); // Init is_delete_page?
    $group = filter('group', 'number'); // Init is_group_page?
    $page  = filter('page', 'number'); // Init which books you should send to AJAX
    $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['author', 'genre', 'inventory_no', 'Date_of_issue']) ? $_GET['order'] : 'name'; // Init which order you ewant

    $mysql = mysqli_connect('localhost', 'root', '', 'Lib'); // Connect to mysql

    if (!$mysql) exit('<h1>Ошибка Подключения</h1>'); // If error, exit

    function add_book($mysql, $q, $im, $del, $order, $group, $page=0) { // function for adding books

        $books = array();
        $page--;
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

        if (is_null($bk)) exit("Ничего не найдено");

        if ($im && $del) $href = "give.php?us=$im&bk=";
        elseif ($im)     $href = "get.php?us=$im&bk=";
        else             $href = "books.php/";

        do { // While to adding books
            $bk['Group_ID'] = $group || $del || ($order == 'inventory_no' && $q) ? '': $bk['Group_ID'];
            $gid = $bk['Group_ID'];

            if ($gid) { // If this book in group

                $res1 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid'");
                $res2 = mysqli_query($mysql, "SELECT COUNT(*) as g FROM `books` WHERE Group_ID = '$gid' AND `User_id`");
                $all  = mysqli_fetch_assoc($res1)['g']; // Get count of books
                $busy = mysqli_fetch_assoc($res2)['g']; // Get count of busy books

                $bk['Inventory_NO'] = "$busy/$all";

            } else { // General book without group_id 
                $id = $bk['User_id']; // Get user id in book
                $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
                $user = mysqli_fetch_assoc($res); // Get user
                
                $bk['Username']      = $user['Surname'].' '.$user['Firstname'].' '.$user['Lastname'];
                $bk['Date_of_issue'] = $bk['Date_of_issue'] ? date('d.m.y', strtotime($bk['Date_of_issue'])) : Null;

                if ($im && !$del && !is_null($id)) {
                    $bk['Class'] = 'result';
                    $bk['href'] = '';
                } else { 
                    $bk['Class'] = 'result valid';
                    $bk['href'] = $href.$bk['ID'];
                }
            }
            array_push($books, $bk);

        } while ($bk = mysqli_fetch_assoc($result));
        
        // echo '</div>';
        $json = json_encode($books);
        echo $json;
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

    <link rel="stylesheet" type="text/css" href="sources/style/button.css">
    <link rel="stylesheet" type="text/css" href="sources/style/search.css">
    <link rel="stylesheet" type="text/css" href="sources/style/message.css">
    <script src="sources/js/search.js"></script>
    <script src="sources/js/message.js"></script>
</head>

<body>
	<div class="toolbar">
        <div class="but" id="edit"></div>
        <div class="but" id="del" message="delete"></div>
    </div>

	<a class="but" id="home" href="/"></a>  <!-- Button home -->
	<a id="up" class="but hidden"></a> <!-- Button Up -->

	<div class="dark" id="delete"> <!-- window -->
        <div class="alert_window">
            <div class="alert_message" id="result">
                Будет удалено 34 книги. 30 из группы и 4 одиночных<br>Продолжить?
            </div>
            <div class="sure">
                <div class="but_window_space">
                    <div class="but_window" href="" id="link">Удалить</div>
                </div>
                <div class="but_window_space">
                    <div class="but_window" id="cancel">Отменить</div>
                </div>
            </div>
        </div>
    </div>

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

        $arr = array('name' => 'Название', 'author' => 'Автор', 'inventory_no' => 'ID', 'genre' => 'Жанр', 'Date_of_issue' => 'Дата');

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
    ?>

    <script type="text/javascript">

        function create_block(data) {

            a = document.createElement('a');

            // If group...
            if (data['Group_ID'] > 0) {
                
                a.className = "result valid group";
                a.href = `search_book.php?q=<?php echo $q ?>&im=<?php echo $im ?>&del=<?php echo $del ?>&order=<?php echo $order ?>&group=${data['Group_ID']}`

                list_books.append(a);

                // A - attribute

                left_part = document.createElement('div');
                left_part.className = "left_part";

                a.append(left_part);

                // Left and Right parts

                choice = document.createElement('div');
                fcs_1  = document.createElement('div');
                info   = document.createElement('div');

                info.innerHTML  = data['Inventory_NO'];

                info.className   = "information";
                choice.className = "choice";
                fcs_1.className  = "FCS";

                left_part.append(choice);
                left_part.append(info);
                left_part.append(fcs_1);

                // Choice

                checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = -data['Group_ID'];

                label = document.createElement('label');
                label.htmlFor = -data['Group_ID'];

                choice.append(checkbox);
                choice.append(label);

                // FCS 1

                name_book = document.createElement('span');
                name_book.className = "name_book";
                name_book.innerHTML = data['Name'];

                autor_book = document.createElement('span');
                autor_book.className = 'autor_book';
                autor_book.innerHTML = data['Author'];

                date = document.createElement('div');
                date.className = 'date';
                date.innerHTML = data['Date_of_issue'];

                fcs_1.append(name_book);
                fcs_1.append(autor_book);
                fcs_1.append(date);

            } else {
                
                a.className = data['Class'];
                
                if (data['href']) a.href = data['href'];

                list_books.append(a);

                // A - attribute

                left_part = document.createElement('div');
                left_part.className = "left_part";

                right_part = document.createElement('div');
                right_part.className = "right_part";

                a.append(left_part);
                a.append(right_part);

                // Left and Right parts

                choice = document.createElement('div');
                fcs_1  = document.createElement('div');

                info   = document.createElement('div');
                fcs_2  = document.createElement('div');

                info.innerHTML  = data['Inventory_NO'];

                if (data['User_id'] > 0) {
                    fcs_span = document.createElement('span');
                    fcs_span.innerHTML = data['Username'];
                } else {
                    fcs_2.innerHTML = "Свободна"; 
                }

                info.className   = "information";
                choice.className = "choice";
                fcs_1.className  = "FCS";
                fcs_2.className  = "FCS";

                left_part.append(choice);
                left_part.append(fcs_1);

                right_part.append(info);
                right_part.append(fcs_2);

                if (data['User_id'] > 0) fcs_2.append(fcs_span);

                // Choice

                checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = data['ID'];

                label = document.createElement('label');
                label.htmlFor = data['ID'];

                choice.append(checkbox);
                choice.append(label);

                // FCS 1

                name_book = document.createElement('span');
                name_book.className = "name_book";
                name_book.innerHTML = data['Name'];

                autor_book = document.createElement('span');
                autor_book.className = 'autor_book';
                autor_book.innerHTML = data['Author'];

                date = document.createElement('div');
                date.className = 'date';
                date.innerHTML = data['Date_of_issue'];

                fcs_1.append(name_book);
                fcs_1.append(autor_book);
                fcs_1.append(date);
            }
        }

        var page = 1;
        var allowLoading = true; // Check, if request is free
        var is_end_of_books = false; // Check, if books is finished
        var site = document.documentElement; // All html document
        var list_books = document.querySelector('.search_result'); // Div for all books

        var url = `search_book.php?q=<?php echo $q ?>&im=<?php echo $im ?>&del=<?php echo $del ?>&order=<?php echo $order ?>&group=<?php echo $group ?>&page=${page}`;
        ajax(url, add, 'GET'); // Call Ajax funciton

        function add(data) {
            console.log("New stack...")
            if (data != "Ничего не найдено") {
                data = JSON.parse(data)

                for (let i = 0; i < data.length; i++) {
                    create_block(data[i]);
                }
                page += 20;
                    
            } else {
                if (page === 1) list_books.innerHTML = "Ничего не найдено";

                is_end_of_books = true;
            }
        }

        function result(data) {
            document.querySelector('.alert_message').innerHTML = data;
            document.querySelector('#cancel').innerHTML = 'Ок'; // Это надо будет исправить!!!
        }

        function ajax(url, success, method, data="") { // Send and Get Ajax-request
            if (!allowLoading) return
            allowLoading = false;

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() { // If request is comeback
                if (request.readyState == 4 && request.status == 200) {
                    var req = request.responseText;
                    success(req); // If success request, call function
                    allowLoading = true;
                }
            }

            request.open(method, url);
            
            if (method == 'GET') request.setRequestHeader('Content-Type', 'application/x-www-form-url');
            else                 request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            request.send(data); // Send ajax request
        }
        
        function ready() {
            if (!is_end_of_books && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
                var url = `search_book.php?q=<?php echo $q ?>&im=<?php echo $im ?>&del=<?php echo $del ?>&order=<?php echo $order ?>&group=<?php echo $group ?>&page=${page}`;
                ajax(url, add, 'GET'); // Call Ajax funciton
            }
        }

        document.querySelector('#link').onclick = function() { // If user touch delete user button
            var checkboxes = document.querySelectorAll(".сhoice input[type='checkbox']:checked"); // Get all values of checkboxes in users
            var url = 'sources/php/delete_bk.php';
            var params = ''; // Your query

            for (var i = 0; i < checkboxes.length; i++) {
                params += `${i+1}=${checkboxes[i].id}&`;
            }
            ajax(url, result, 'POST', params);
        }

        document.addEventListener('scroll', ready); // Event for listen your scroll in site
    </script>
</body>
</html>