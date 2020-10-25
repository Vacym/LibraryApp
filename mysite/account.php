<!-- version 1.1  Высший уровень говнокода-->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/account.css">
</head>

<body>
    <?php

        $url_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $url_parts = explode('/', trim($url_path, ' /'));
        $Page = array_shift($url_parts);
        $id = array_shift($url_parts);

        if (!ctype_digit($id)){
            echo 'Неправильный ввод';
            exit();
        }

        $mysql = mysqli_connect('localhost', 'root', '', 'test');
        $q = mysqli_query($mysql, "SELECT * FROM `users` WHERE id = '$id'");
        $user = mysqli_fetch_assoc($q);

        if ( is_null($user) ){
            echo 'Такого пользователя нет';
            exit();
        }
        else {
            echo '<div class="box">';
            echo '<div class="head">';
            echo '<nav>';
            echo '<a href="#" class="but" id="edit"></a>';
            echo '</nav>';
            echo '<table class="head_information">';
            echo '<tr>';
            echo '<td class="td_head">ФИО: </td>';
            echo '<td class="td_value">', $user['Surname'], ' ', $user['Name'], ' ', $user['Lastname'], '</td></tr>';
            echo '<tr>';
            echo '<td class="td_head">Класс: </td>';
            echo '<td class="td_value">', $user['Class'], $user['Letter'], '</td>';
            echo '</tr></table>';
            echo '</div>';
            echo '<div class="information">';
            echo '<nav>';
            echo '<a href="#" class="but" id="add_book"></a>';
            echo '<a href="#" class="but" id="delete_book" clickable="false"></a>';
            echo '</nav>';
            echo '<table class="books">';
            echo '<tr>';
            echo '<th class="td_head">Книга</th>';
            echo '<th class="td_value">Дата выдачи</th>';
            echo '</tr>';

            $q = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");
            $bk = mysqli_fetch_assoc($q);

            if ( is_null($bk) ) {
                echo '<tr>';
                echo '<td class="td_head">Нет книг</td>';
                echo '<td class="td_value">-</td>';
                echo '</tr>';
            }
            else {
                do {

                    if ( is_null($bk['Date_of_issue']) ){
                        $date = '-';
                    }
                    else {
                        $date = $bk['Date_of_issue'];
                    }

                    echo '<tr>';
                    echo '<td class="td_head">', $bk['Name'], '</td>';
                    echo '<td class="td_value">', $date, '</td>';
                    echo '</tr>';
                } while ($bk = mysqli_fetch_assoc($q) );
            }
            echo '</table>';
            echo '</div></div>';
        }
    ?>

</body>

</html>