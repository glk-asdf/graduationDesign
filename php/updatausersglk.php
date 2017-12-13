<?php
$mysqli=new mysqli('localhost','root','root','test');
$sql="UPDATE usersglk SET password='{$_GET[password]}' where name='{$_GET[name]}'";
$mysqli->query($sql);
echo "success";
?>