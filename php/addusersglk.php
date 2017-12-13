<?php
$mysqli=new mysqli('localhost','root','root','test');
$sql="INSERT INTO usersglk (name,password,manage) VALUE ('{$_GET[name]}','{$_GET[password]}','{$_GET[manage]}')";
$mysqli->query($sql);
echo $mysqli->insert_id;
?>