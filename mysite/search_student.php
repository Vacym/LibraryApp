<?php

    $q     = filter_input(INPUT_GET, 'q')  && preg_match('/^(\d|[а-я ]|[\.-])+$/ui', $_GET['q']) ? $_GET['q']: ''; // General parameter - query
    $im    = filter_input(INPUT_GET, 'im') && preg_match('/^\d+$/', $_GET['im']) ? $_GET['im']: ''; // Parameter for connect user with book
    $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['firstname', 'lastname', 'class', 'letter']) ? $_GET['order'] : 'surname'; // Parameter for change search opinion
    $page  = filter_input(INPUT_GET, 'page') && preg_match('/^\d+$/', $_GET['page']) ? $_GET['page']: '';
    
    $mysql = mysqli_connect('localhost', 'root', '', 'Lib'); // Connect with MYSQL

    if (!$mysql) exit('<h1>Ошибка Подключения</h1>'); // If connection error
    
    function add_user($mysql, $q, $im, $order, $page=0) { // Function for adding new 20 users in site 

    	$users = array();
        $page--;

    	$query = "SELECT * FROM `users` WHERE $order LIKE '$q%' ORDER BY BINARY(lower($order)) LIMIT 20 OFFSET $page"; // Query for any parameter
    	if ($order == 'class') $query = "SELECT * FROM `users` WHERE CONCAT(Class,Letter) LIKE '$q%' ORDER BY Class LIMIT 20 OFFSET $page"; // Only for class number

        $result = mysqli_query($mysql, $query); // Send query
        $st = mysqli_fetch_assoc($result); // Get first query

        if (is_null($st)) exit("Ничего не найдено"); // If not found show

        $href = "account.php/"; // Source for follow the account
        if ($im) $href = "get.php?bk=$im&us="; // Source for book a book

        do {
            $id = $st['ID']; // User id

            $user = array(); // User db
            $user['ID'] = $id; // User id
            $user['books'] = array(); // Books db
            $user['href'] = $href.$user['ID']; // href for block
            $user['Class'] = $st['Class'].' '.$st['Letter'];
            $user['Username'] = $st['Surname'].' '.$st['Firstname'].' '.$st['Lastname'];

            $res = mysqli_query($mysql, "SELECT `Name`, `Author`, `Date_of_issue` FROM `books` WHERE `User_id` = '$id'"); // Get user books

            while ($bk = mysqli_fetch_assoc($res)) { // While output user books
                $bk['Date'] = date('d.m.y', strtotime($bk['Date_of_issue']));

                array_push($user['books'], $bk);
            }
            array_push($users, $user);

        } while ($st = mysqli_fetch_assoc($result)); // While user have in the database

        $json = json_encode($users);
        echo $json;
    }

    if ($page) { // If you scroll down and you want new 20 users
    	add_user($mysql, $q, $im, $order, $page);
    	exit();
    }
?>
<!-- version 1.0 release -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Найти ученика</title>

    <link rel="stylesheet" type="text/css" href="sources/style/button.css">
    <link rel="stylesheet" type="text/css" href="sources/style/search.css">
    <link rel="stylesheet" type="text/css" href="sources/style/message.css">
    <script src="sources/js/search.js"></script>
    <script src="sources/js/message.js"></script>
</head>

<body>
    <div class="toolbar">
        <div id="summ_checked">Выделено: <span></span></div>
        <div class="toolbar_buttons">
            <div class="but" id="remove"></div>
            <div class="but" id="edit"></div>
            <div class="but" id="del" message="delete"></div>
        </div>
    </div>

    <a class="but" id="home" href="/"></a> <!-- Button home -->
    <a id="up" class="but hidden"></a> <!-- Button Up -->

    <div class="dark" id="delete"> <!-- Toolbar -->
        <div class="alert_window">
            <div class="alert_message" id="result">
                Будет удалено 34 ученика<br>Продолжить?
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

    <h2>Поиск учеников</h2>

    <?php
        echo '<div class="find_input">';
        echo '<form action="" method="GET">';
        echo "<input type='search' name='q' value='$q' id='input' autocomplete='off' autofocus>";
        echo '<select name="order">';

        $arr = array('surname' => 'Фамилия', 'firstname' => 'Имя', 'lastname' => 'Отчество', 'class' => 'Класс'); // Parameters

        foreach ($arr as $i => $j) {
            if ($i == $order) echo "<option value='$i' selected>$j</option>";
            else              echo "<option value='$i'>$j</option>"; 
        }
        echo '</select>';
        
        if ($im) echo "<input type='hidden' name='im' value='$im'>"; // If librarian wants to connect user with book

        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
        echo '<div class="search_result">';
	    echo '</div>';  
    ?>

    <script type="text/javascript">

        function create_block(data) {   // Здесь будет создание блоков с учениками

            a = document.createElement('a');

            a.className = 'result valid';
            a.href = data['href'];

            var innerHTML = `<div class="left_part">\
                                <div class="choice">\
                                    <input type="checkbox" id="${data['ID']}">\
                                    <label for="${data['ID']}"></label>\
                                </div>`;

            data['books'].forEach((book) => {

                innerHTML += `\
                    <div class="book">\
                        <span class="name_book">${book['Name']}</span>\
                        <span class="autor_book">${book['Author']}</span>\
                        <span class="date">${book['Date']}</span>\
                    </div>
                `;
            })

            innerHTML += `</div>
                    <div class="right_part">\
                        <div class="information">${data['Class']}</div>\
                        <div class="FCS">${data['Username']}</div>\
                    </div>`;
            
            a.innerHTML = innerHTML;

            list_books.append(a);
        }

        var page = 1;
        var allowLoading = true; // Check, if request is free
        var is_end_of_books = false; // Check, if books is finished in database
        var site = document.documentElement; // All html document
        var list_books = document.querySelector('.search_result'); // Div for all books

        var url =  `search_student.php?q=<?php echo $q ?>&im=<?php echo $im ?>&order=<?php echo $order ?>&page=${page}`;
        ajax(url, add, 'GET'); // Call Ajax funciton

        function add(data) {
            console.log("New stack...")
            if (data != "Ничего не найдено") {
                data = JSON.parse(data);

                for (let i = 0; i < data.length; i++) {
                    create_block(data[i]);
                }
                tool.append_listener_for_new_change();
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
            else 				 request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            request.send(data); // Send ajax request
        }

        function ready() {
            if (!is_end_of_books && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
                var url = `search_student.php?q=<?php echo $q ?>&im=<?php echo $im ?>&order=<?php echo $order ?>&page=${page}`;
                ajax(url, add, 'GET');
            }
        }

        document.querySelector('#link').onclick = function() { // If user touch delete user button
        	var checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked"); // Get all values of checkboxes in users
        	var url = 'sources/php/delete_st.php';
        	var params = ''; // Your query

        	for (var i = 0; i < checkboxes.length; i++) {
        		params += `${i+1}=${checkboxes[i].id}&`;
        	}
        	ajax(url, result, 'POST', params);
        }

        document.querySelector('#del').onclick = function() {
        	var count = document.querySelectorAll(".choice input[type='checkbox']:checked").length

        	valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удален'];
        	valid_2 = ['иков', 'ика', 'ик'];

        	if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
        	else if (count%10 >= 2 && count%10 < 5) 								 i = 1;
        	else 									 								 i = 2;

        	document.querySelector('#result').innerHTML = `${valid_1[i]} ${count} учен${valid_2[i]}<br>Продолжить?`;
        }

        document.addEventListener('scroll', ready);
    </script>

</body>
</html>