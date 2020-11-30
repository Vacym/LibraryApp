<?php

    $q     = filter_input(INPUT_GET, 'q')  && preg_match('/^(\d|[а-я ]|[\.-])+$/ui', $_GET['q']) ? $_GET['q']: ''; // General parameter - query
    $im    = filter_input(INPUT_GET, 'im') && preg_match('/^\d+$/', $_GET['im']) ? $_GET['im']: ''; // Parameter for connect user with book
    $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['firstname', 'lastname', 'class', 'letter']) ? $_GET['order'] : 'surname'; // Parameter for change search opinion
    $page  = filter_input(INPUT_GET, 'page') && preg_match('/^\d+$/', $_GET['page']) ? $_GET['page']: '';

    function add_user($q, $im, $order, $page=0) { // Function for adding new 20 users in site 

    	$mysql = mysqli_connect('localhost', 'root', '', 'Lib'); // Connect with MYSQL

    	if (!$mysql) exit('<h1>Ошибка Подключения</h1>'); // If connection error

    	$query = "SELECT * FROM `users` WHERE $order LIKE '$q%' ORDER BY BINARY(lower($order)) LIMIT 20 OFFSET $page"; // Query for any parameter
    	if ($order == 'class') $query = "SELECT * FROM `users` WHERE CONCAT(Class,Letter) LIKE '$q%' ORDER BY Class LIMIT 20 OFFSET $page"; // Only for class number

        $result = mysqli_query($mysql, $query); // Send query
        $st = mysqli_fetch_assoc($result); // Get first query

        if (is_null($st)) exit("Ничего не найдено"); // If not found show

        if ($im) $src = "<a class='result valid' href='get.php?bk=$im&us="; // Source for book a book
        else     $src = "<a class='result valid' href='/account.php/"; // Source for follow the account

        do {    
            $id = $st['ID']; // User id
            $res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'"); // Get user books

            echo $src, $id, "'>";
            echo '<div class="left_part">';
            echo '<div class="choice">'; // Check box for edit users
            echo "<input type='checkbox' id='{$st['ID']}'>";
            echo "<label for='{$st['ID']}'></label>";
            echo '</div>';

            while ($bk = mysqli_fetch_assoc($res)) { // While output user books
                $date = date('d.m.y', strtotime($bk['Date_of_issue']));

                echo '<div class="book">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
                echo "<span class='date'>$date</span>";
                echo '</div>';
            }
            
            echo '</div>';
            echo '<div class="right_part">';
            echo "<div class='information'>{$st['Class']} {$st['Letter']}</div>";
            echo "<div class='FCS'>{$st['Surname']} {$st['Firstname']} {$st['Lastname']}</div>";
            echo '</div></a>';

        } while ($st = mysqli_fetch_assoc($result)); // While user have in the database
    }

    if ($page) { // If you scroll down and you want new 20 users
    	add_user($q, $im, $order, $page);
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
        <div class="but" id="edit"></div>
        <div class="but" id="del" message="delete"></div>
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

        add_user($q, $im, $order); // Show first 20 users

	    echo '</div>';        
        
    ?>

    <script type="text/javascript">

        function create_block(data) {   // Здесь будет создание блоков с учениками

        }

        var page = 20;
        var allowLoading = true; // Check, if request is free
        var is_end_of_books = false; // Check, if books is finished in database
        var site = document.documentElement; // All html document
        var list_books = document.querySelector('.search_result'); // Div for all books

        function add(data) {
        	console.log("New stack...")
            if (data != "Ничего не найдено") {
                list_books.innerHTML += data; // Add new 20 books
                page += 20;
            } else {
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