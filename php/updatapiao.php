<?php
$mysqli=new mysqli('localhost','root','root','test');
$sql="UPDATE usersglk SET piao='{$_GET[piao]}' where name='{$_GET[name]}'";
$mysqli->query($sql);
echo "success";
?>