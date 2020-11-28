<?php

    $q     = filter_input(INPUT_GET, 'q')  && preg_match('/^(\d|[а-я ]|[\.-])+$/ui', $_GET['q']) ? $_GET['q']: '';
    $im    = filter_input(INPUT_GET, 'im') && preg_match('/^\d+$/', $_GET['im']) ? $_GET['im']: '';
    $order = filter_input(INPUT_GET, 'order') && in_array($_GET['order'], ['firstname', 'lastname', 'class', 'letter']) ? $_GET['order'] : 'surname';
    $page  = filter_input(INPUT_GET, 'page') && preg_match('/^\d+$/', $_GET['page']) ? $_GET['page']: '';

    function add_user($q, $im, $order, $page=0) {

    	$mysql = mysqli_connect('localhost', 'root', '', 'Lib');

    	if (!$mysql) exit('<h1>Ошибка Подключения</h1>');

    	$query = "SELECT * FROM `users` WHERE $order LIKE '$q%' ORDER BY BINARY(lower($order)) LIMIT 20 OFFSET $page";
    	if ($order == 'class') { $query = "SELECT * FROM `users` WHERE CONCAT(Class,Letter) LIKE '$q%' ORDER BY Class LIMIT 20 OFFSET $page"; }

        $result = mysqli_query($mysql, $query);
        $st = mysqli_fetch_assoc($result);

        if (is_null($st)) {
        	exit("Ничего не найдено");
    	}

        if ($im) { $src = "<a class='result valid' href='get.php?bk=$im&us="; } 
        else     { $src = "<a class='result valid' href='/account.php/"; }

        do {    
            $id = $st['ID'];
            $res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");

            echo $src, $id, "'>";
            echo '<div class="left_part">';
            echo '<div class="сhoice">';
            echo "<input type='checkbox' id='{$st['ID']}'>";
            echo "<label for='{$st['ID']}'></label>";
            echo '</div>';

            while ($bk = mysqli_fetch_assoc($res)) {
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

        } while ($st = mysqli_fetch_assoc($result));
    }

    if ($page) {
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

    <a class="but" id="home" href="/"></a>
    <a id="up" class="but hidden"></a> <!-- Button Up -->

    <div class="dark" id="delete">
        <div class="alert_window">
            <div class="alert_message" id="result">
                Будет удалено 34 ученика<br>Продолжить?
            </div>
            <div class="sure">
                <div class="but_window_space">
                    <a class="but_window" href="" id="link">Удалить</a>
                </div>
                <div class="but_window_space">
                    <div class="but_window" id="cancel">Отменить</div>
                </div>
            </div>
        </div>
    </div>

    <h2>Поиск Учеников</h2>

    <?php
        echo '<div class="find_input">';
        echo '<form action="" method="GET">';
        echo "<input type='search' name='q' value='$q' id='input' autocomplete='off' autofocus>";
        echo '<select name="order">';

        $arr = array('surname' => 'Фамилия', 'firstname' => 'Имя', 'lastname' => 'Отчество', 'class' => 'Класс');

        foreach ($arr as $i => $j) {
            if ($i == $order) echo "<option value='$i' selected>$j</option>";
            else              echo "<option value='$i'>$j</option>"; 
        }
        echo '</select>';
        
        if ($im) echo "<input type='hidden' name='im' value='$im'>";

        echo '<button type="submit" id="submit"></button>';
        echo '</form></div>';
        echo '<div class="search_result">';

        add_user($q, $im, $order);

	    echo '</div>';        
        
    ?>

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
            if (!is_end_of_books && site.scrollTop + site.clientHeight + 200 >= site.scrollHeight) {
                var url = `search_student.php?q=<?php echo $q ?>&im=<?php echo $im ?>&order=<?php echo $order ?>&page=${page}`;

                ajax(url);
            }
        }
        document.addEventListener('scroll', ready)
    </script>

</body>
</html>