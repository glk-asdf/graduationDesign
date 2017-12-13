<?php
$mysqli=new mysqli('localhost','root','root','test');
$sql="INSERT INTO message (title,content) VALUE ('{$_GET[title]}','{$_GET[content]}')";
$mysqli->query($sql);
echo $mysqli->insert_id;
?>