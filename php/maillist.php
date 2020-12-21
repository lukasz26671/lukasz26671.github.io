<?php 

$conn = new mysqli("54.38.50.59", "www4864_f", "hKA8tVkhni6nGjyvPgYm", "www4864_f");

$table_creation = 'CREATE TABLE IF NOT EXISTS `mail_list` (`id` int(11) NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `data` varchar(255) NOT NULL, PRIMARY KEY (`id`))' ;

$conn->query($table_creation);

if(isset($_POST["email"])) {
    $e =  $_POST["email"];
    $date = date("Y-m-d h:i:sa");
    $mail_stmt = "SELECT * FROM `mail_list` WHERE `email`=?";

    $stmt = $conn->prepare($mail_stmt);
    $stmt->bind_param('s', $e);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    if(count($row) > 0) {
        header("Location: .?err=ex");
    } else {
        $insert_stmt = "INSERT INTO `mail_list` (`email`, `data`) VALUES (?, ?)";
        $stmt = $conn->prepare($insert_stmt);
        $stmt->bind_param('ss', $e, $date);
        $stmt->execute();
    }

    $conn->close();
} 
    header("Location: .");
?>