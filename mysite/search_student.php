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
        	if ($page) exit();
        	exit("Ничего не найдено");
    	}

        if ($im) { $src = "<a class='result valid' href='get.php?bk=$im&us="; } 
        else     { $src = "<a class='result valid' href='/account.php/"; }

        do {    
            $id = $st['ID'];
            $res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");

            echo $src, $id, "'>";
            echo '<div class="left_part">';

            while ($bk = mysqli_fetch_assoc($res)) {
                echo '<div class="book">';
                echo "<span class='name_book'>{$bk['Name']}</span>";
                echo "<span class='autor_book'>{$bk['Author']}</span>";
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

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/search.css">
    <script src="sources/js/ajax.js"></script>
    <script src="sources/js/search.js"></script>
</head>

<body>
    <a class="but" id="home" href="/"></a>

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
    <a id="up" class="but hidden"></a>

    <script type="text/javascript">
    	$(document).ready(function () {
    		var page = 5;
    		var book_finish = false;

    		$(window).scroll(function () {
		    	if ($(window).scrollTop() + $(window).height() >= $(document).height() - 5 && !book_finish) {
			    	$.ajax({
			    		url: 'search_student.php',
			    		method: 'get',
			    		dataType: 'html',
			    		data: {'q': '<?php echo $q ?>', 'im': '<?php echo $im ?>', 'order': '<?php echo $order ?>', 'page': page},
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