<?php
$mysqli=new mysqli('localhost','root','root','test');
$query='select * from tempdata order by id';
$result=$mysqli->query($query);
$row=$result->fetch_all(MYSQLI_ASSOC);
echo json_encode($row);
?>