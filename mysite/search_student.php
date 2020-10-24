<!-- version 1.2 -->

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>Найти ученика</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="sources/style/search_student.css">
</head>

<body>
    <div class="find_input">
        <form action="" method="get">
            <input type="search" name="q" id="input" class="">
            <button type="submit" id="submit" onclick="search_click()"></button>
        </form>
    </div>

    <?php

        $mysql = mysqli_connect('localhost', 'root', '', 'test');

        if (!$mysql) { 
            echo "Ошибка Подключения";
            exit(); 
        }

        if (!count($_GET)){
            $q = '';
        } else { 
            $q = $_GET['q'];
        }
        
        $query = "SELECT * FROM `users` WHERE `surname` LIKE '%$q%'";        
        $result = mysqli_query($mysql, $query);

        while ($st = mysqli_fetch_assoc($result))
        {
        	echo '<div class="search_result">';
        	echo '<div class="result">';
        	echo '<div class="personal_information">';
        	echo '<div class="FCS">';
        	echo '<div class="class">', $st['Class'], $st['Letter'], '</div>';
        	echo $st['Surname'], ' ', $st['Name'], ' ', $st['Lastname'];
        	echo '</div>';
        	echo '</div>';
        	echo '<div class="books">';

        	$id = $st['ID'];
        	$res = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");

        	while ($bk = mysqli_fetch_assoc($res)) {
        		echo '<div class="one_book">';
        		echo '<span class="name_book">', $bk['Name'], '</span>';
        		echo '<span class="autor_book">', $bk['Author'] , '</span>';
        		echo '</div>';
        	}
        	
        	echo '</div></div></div>';
        }
        
    ?>

</body>

</html>
