<!-- version 2.0 -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Поиск книги</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="sources/style/search.css">
</head>

<body>
    <div class="find_input">
        <form action="" method="get">
            <input type="search" name="q" id="input">
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

        while ($bk = mysqli_fetch_assoc($result))
        {
            $id = $bk['User_id'];
            $res = mysqli_query($mysql, "SELECT * FROM `users` WHERE `ID` = '$id'");
            $user = mysqli_fetch_assoc($res);
            
            echo '<div class="search_result">';
            echo '<div class="result">';
            echo '<div class="name">';
            echo '<span class="name_book">', $bk['Name'], '</span>';
            echo '<span class="autor_book">', $bk['Author'], '</span>';
            echo '</div>';
            echo '<div class="status" status="empl">';

            if (is_null($user)) {
                echo 'Свободна';
            }
            else {
                echo $user['Surname'], ' ', $user['Name'], ' ', $user['Lastname'];
            }
            echo '</div></div></div>';
        }
        
    ?>

</body>
</html>