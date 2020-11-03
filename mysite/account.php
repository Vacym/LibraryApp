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
    <div class="dark" id="w_del">
        <div class="alert_window">
            <div> А вы точно уверены в своём действии? Учтите, ваше решение отменить будет уже нельзя никак. Подумайте, прежде чем что-то делать! Дайте мне шанс. Неужели это единственная возможность для нас всё исправить? Умоляю! Я вам жизнью обязан! Я уверен,
                что всё ещё поправимо! Дайте мне шанс! А мы всегда будем рады вас видеть! Честно, всегда! А если что- нибудь ещё понадобится – милости просим, только скажите… Что, нельзя? Пожалуйста, не надо! Нет, до свидания… Ну и ну. Всё.</div>
            <div class="sure">
                <div class="but_window" id="cansel">Отменить</div>
                <a class="but_window" href="delete">Удалить</a>
            </div>
        </div>
    </div>

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

                    header("refresh:2;url=/account.php/$id");
                    exit();
                }

                mysqli_query($mysql, "UPDATE `users` SET `Firstname` = '$firstname', `Surname` = '$surname', `Lastname` = '$lastname', `Class` = '$class', `Letter` = '$letter' WHERE `ID` = '$id'");
                
                echo '<h1>Ученик успешно изменен!</h1>';

                header("refresh:2;url=/account.php/$id");
                exit();
            }

            if ($user['Lastname'] == 'Без отчества') $user['Lastname'] = '';

            echo "<div class='box'>";
            echo '<h1>Редактировать профиль</h1>';    
            echo '<nav><div class="but" id="del"></div></nav>';
            echo '<form action="" method="POST">';

            $arr = array('surname' => 'Фамилия', 'firstname' => 'Имя', 'lastname' => 'Отчество', 'class' => 'Класс', 'letter' => 'Буква');

            foreach ($arr as $i => $j) {
                echo '<div class="line">';
                if ($i == 'lastname') echo '<input type="text" name="',$i,'" id="',$i,'" value="',$user[ucfirst($i)],'" autocomplete="off">';
                else 				  echo '<input type="text" name="',$i,'" id="',$i,'" value="',$user[ucfirst($i)],'" class="necessary_input" autocomplete="off">';
                echo '<label for="',$i,'">',$j,'</label></div>';
            }

            echo '<div><input type="submit" id="submit" value="Сохранить" disabled></div></div>';
            exit();

        } else if ($choose == 'delete') {
            
            mysqli_query($mysql, "UPDATE `books` SET `User_id` = NULL, `Date_of_issue` = NULL WHERE `User_id` = '$id'");
            mysqli_query($mysql, "DELETE FROM `users` WHERE `ID` = '$id'");

            echo '<h1>Ученик успешно удален!</h1>';

            header("refresh:2;url=/");
            exit();
        }

        $q = mysqli_query($mysql, "SELECT * FROM `books` WHERE `User_id` = '$id'");
        $book = mysqli_fetch_assoc($q);

        echo '<div class="box" style="width: 75%;">';
        echo '<div class="head">';
        echo '<nav><a href="/account.php/', $id, '/edit" class="but" id="edit"></a></nav>';
        echo '<table class="head_information"><tr>';
        echo '<td class="td_head">ФИО: </td>';
        echo '<td class="td_value">', $user['Surname'], ' ', $user['Firstname'], ' ', $user['Lastname'], '</td></tr><tr>';
        echo '<td class="td_head">Класс: </td>';
        echo '<td class="td_value">', $user['Class'], $user['Letter'], '</td>';
        echo '</tr></table></div>';
        echo '<div class="information">';
        echo '<nav>';
        echo '<a href="/search_book.php?im=', $id, '" class="but" id="add_book"></a>';

        if (!is_null($book)) {
            echo '<a href="/search_book.php?im=', $id, '&del=1" class="but" id="delate_book"></a>';
        }

        echo '</nav>';
        echo '<table class="books">';
        echo '<tr>';
        echo '<th class="td_head">Книга</th>';
        echo '<th class="td_value">Дата выдачи</th>';
        echo '</tr>';

        if (is_null($book)) {
            echo '<tr>';
            echo '<td class="td_head">Нет книг</td>';
            echo '<td class="td_value">-</td>';
            echo '</tr></table></div></div>';
            exit();
        }

        do {

            if (is_null($book['Date_of_issue'])) $date = '-';
            else                                 $date = $book['Date_of_issue'];

            echo '<tr>';
            echo '<td class="td_head">',  $book['Name'], '</td>';
            echo '<td class="td_value">', $date, 	   '</td>';
            echo '</tr>';

        } while ($book = mysqli_fetch_assoc($q));

        echo '</table>';
        echo '</div></div>';
        exit();
    ?>

</body>

</html>