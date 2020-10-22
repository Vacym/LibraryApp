<!-- version 1.2 -->

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>Поиск книги</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" href="sources/style/find_user.css">
    <script src="sources/js/find_user.js"></script>
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
        
        $query = "SELECT * FROM `books` WHERE `name` LIKE '%$q%'";        
        $result = mysqli_query($mysql, $query);

        while ($st = mysqli_fetch_assoc($result))
        {
            echo '<div class="search_result">', $st['Name'], '</div>';
        }
        
    ?>

</body>
</html>