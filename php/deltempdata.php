<?php
$mysqli=new mysqli('localhost','root','root','test');
$squery="DELETE from tempdata where name='{$_GET[name]}'";
$mysqli->query($squery);
echo "success";
?>