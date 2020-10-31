<!-- version 1.3  Вроде что-то пойдет в лучшую сторону -->

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/sources/style/account.css">
    <script src="/sources/js/add.js"></script>
</head>

<body>
	<a class="but" id="home" href="/"></a>

    <?php

        $url_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $url_parts = explode('/', trim($url_path, ' /'));
        $page   = array_shift($url_parts);
        $id     = array_shift($url_parts);
        $choose = array_shift($url_parts);

        if (!ctype_digit($id)){
            echo '<h1>Такой страницы не существует!</h1>';
            exit();
        }

        $mysql = mysqli_connect('localhost', 'root', '', 'test');
        $q = mysqli_query($mysql, "SELECT * FROM `users` WHERE id = '$id'");
        $user = mysqli_fetch_assoc($q);

        if (is_null($user)){
            echo '<h1>Такого пользователя нет</h1>';
            exit();
        } 
        else {
            if ($choose == 'edit') {

                if (count($_POST)){
                    $firstname = $_POST['firstname'];
                    $surname   = $_POST['surname'];
                    $lastname  = $_POST['lastname'];
                    $class     = $_POST['class'];
                    $letter    = $_POST['letter'];

                    $valid_name = preg_match("/^[а-я-]+$/ui", $firstname);
                    $valid_surn = preg_match("/^[а-я-]+$/ui", $surname);
                    $valid_last = preg_match("/^[а-я-]+$/ui", $lastname);
                    $valid_clss = preg_match("/^([1-9]|1[01])$/", $class);
                    $valid_lttr = preg_match("/^[А-Я]$/u", $letter);

                    if (trim($lastname) == "") {
                        $lastname = "Без отчества";
                        $valid_last = True;
                    }

                    if (!$valid_name || !$valid_surn || !$valid_last || !$valid_clss || !$valid_lttr || !ctype_digit($id)) {
                        echo '<h1>Неправильно введенные данные!</h1>';
                    }
                    else {
                        $mysql = new mysqli('localhost', 'root', '', 'test');
                        $mysql->query("UPDATE `users` SET `Name` = '$firstname', `Surname` = '$surname', `Lastname` = '$lastname', `Class` = '$class', `Letter` = '$letter' WHERE `ID` = '$id'");
                        $mysql->close();

                        echo '<h1>Успешно отправлено!</h1>';

                        header("refresh:2;url=/account.php/$id");
                        exit();
                    }
                }

                $lastname = $user['Lastname'];
                if ($user['Lastname'] == 'Без отчества'){ $lastname = ''; }

                echo "<div class='box'>";
                echo "<h1>Редактировать профиль</h1>";    
                echo "<nav><a href='/del' class='but' id='del'></a></nav>";
                echo '<form action="" method="POST">';
                echo '<div class="line">';
                echo '<input type="text" name="surname" id="surname" value="', $user['Surname'], '" class="necessary_input" autocomplete="off">';
                echo '<label for="surname">Фамилия</label></div>';
                echo '<div class="line">';
                echo '<input type="text" name="firstname" id="firsname" value="', $user['Name'], '" class="necessary_input" autocomplete="off">';
                echo '<label for="firsname">Имя</label></div>';
                echo '<div class="line">';
                echo '<input type="text" name="lastname" id="lastname" value="', $lastname, '" autocomplete="off">';
                echo '<label for="lastname">Отчество</label></div>';
                echo '<div class="line">';
                echo '<input type="number" name="class" id="class_number" value="', $user['Class'], '" min="1" max="11" class="necessary_input" autocomplete="off">';
                echo '<label for="class_number">Класс</label></div>';
                echo '<div class="line">';
                echo '<input type="text" name="letter" id="class_letter" value="', $user['Letter'], '" maxlength="1" class="necessary_input" autocomplete="off">';
                echo '<label for="class_letter">Буква</label></div>';
                echo '<div><input type="submit" id="submit" value="Сохранить" disabled></div></div>';

            }
            else {

                echo '<div class="box" style="width: 75%;">';
                echo '<div class="head">';
                echo '<nav>';
                echo '<a href="/account.php/', $id, '/edit" class="but" id="edit"></a>';
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
                echo '<a href="/search_book.php?im=', $id, '" class="but" id="add_book"></a>';
                echo '<a href="/account.php/', $id, '/del" class="but" id="delate_book"></a>';
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
        }
    ?>

</body>

</html>