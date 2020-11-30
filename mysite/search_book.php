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
        
        $json = json_encode($books);
        echo $json;
    }

    if ($page) { // If this is a AJAX query...
        add_book($mysql, $q, $im, $del, $order, $group, $page);
        exit();
    }
?>
<!-- version 1.0 release -->

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

	<a class="but" id="home" href="/"></a> <!-- Button home -->
	<a id="up" class="but hidden"></a> <!-- Button Up -->

	<div class="dark" id="delete"> <!-- Toolbar -->
        <div class="alert_window">
            <div class="alert_message" id="result">
                Будет удалено 34 книги. 30 из группы и 4 одиночных<br>Продолжить?
            </div>
            <div class="sure">
                <div class="but_window_space">
                    <div class="but_window" id="link">Удалить</div>
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
        echo '</div>';
    ?>

    <script type="text/javascript">

        function create_block(data) {

            a = document.createElement('a');

            // If group...
            if (data['Group_ID'] > 0) {
                
                a.className = "result valid group"; // Add parameter class
                a.href = `search_book.php?q=<?php echo $q ?>&im=<?php echo $im ?>&del=<?php echo $del ?>&order=<?php echo $order ?>&group=${data['Group_ID']}` // Add parameter href

                a.innerHTML = `<div class="left_part">\
                                    <div class="choice">\
                                        <input type="checkbox" id="-${data['Group_ID']}">\
                                        <label for="-${data['Group_ID']}"></label>\
                                    </div>\
                                    <div class="information">${data['Inventory_NO']}</div>\
                                    <div class="FCS">\
                                        <span class="name_book">${data['Name']}</span>\
                                        <span class="autor_book">${data['Author']}</span>\
                                    </div>\
                                </div>`;

                list_books.append(a); // Add new block

            } else {
                
                a.className = data['Class']; // Add parameter class
                if (data['href']) a.href = data['href']; // Add parameter href

                date_class = '';
                if (data['Date_of_issue'] != null) date_class = `<div class="date">${data['Date_of_issue']}</div>`;

                a.innerHTML = `<div class="left_part">\
                                    <div class="choice">\
                                        <input type="checkbox" id="${data['ID']}">\
                                        <label for="${data['ID']}"></label>\
                                    </div>\
                                    <div class="FCS">\
                                        <span class="name_book">${data['Name']}</span>\
                                        <span class="autor_book">${data['Author']}</span>\
                                        ${date_class}</div></div>`;

                list_books.append(a); // Add new block

                r_part = document.createElement('div'); // <div class="right_part"></div>
                info   = document.createElement('div'); // <div class="information"></div>
                fcs    = document.createElement('div'); // <div class="FCS"></div>

                fcs.className = 'FCS';
                info.className = 'information';
                r_part.className = 'right_part';

                info.innerHTML = data['Inventory_NO'];

                a.append(r_part);
                r_part.append(info);
                r_part.append(fcs);

                if (data['User_id'] > 0) { // If book is busy
                    fcs_text = document.createElement('span');
                    fcs_text.innerHTML = data['Username'];
                    fcs.append(fcs_text);

                } else {
                    fcs.innerHTML = "Свободна"; 
                }
            }
        }

        var page = 1; // Count of books in one site
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
                append_listener_for_new_change();
                page += 20;
                    
            } else {
                if (page === 1) list_books.innerHTML = "Ничего не найдено";

                is_end_of_books = true;
            }
        }

        function result(data) {
            document.querySelector('.alert_message').innerHTML = data;
            document.querySelector(".but_window_space").remove();

            cancel_button = document.getElementById("cancel");
            cancel_button.innerHTML = 'Ок';
            cancel_button.onclick = () => { window.location = ''; }
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
            var checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked"); // Get all values of checkboxes in users
            var url = 'sources/php/delete_bk.php';
            var params = ''; // Your query

            for (var i = 0; i < checkboxes.length; i++) {
                params += `${i+1}=${checkboxes[i].id}&`;
            }
            ajax(url, result, 'POST', params);
        }

        document.querySelector('#del').onclick = function() {
            var count_group = document.querySelectorAll(".group .choice input[type='checkbox']:checked").length
            var count_books = document.querySelectorAll(".choice input[type='checkbox']:checked").length - count_group

            valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удалена'];
            valid_2 = ['г', 'ги', 'га'];
            valid_3 = ['п', 'пы', 'па'];

            function get_i(count) {
                if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
                else if (count%10 >= 2 && count%10 < 5)                                  i = 1;
                else                                                                     i = 2;
                return i;
            }
            var a = get_i(count_books); // index of count_books
            var b = get_i(count_group); // index of count_groups

            document.querySelector('#result').innerHTML = `${valid_1[a]} ${count_books} кни${valid_2[a]} и ${count_group} груп${valid_3[b]} книг<br>Продолжить?`;
        }

        document.addEventListener('scroll', ready); // Event for listen your scroll in site
    </script>
</body>
</html>