<?php
$mysqli=new mysqli('localhost','root','root','test');
$squery="DELETE from dataglk where name='{$_GET[name]}'";
$mysqli->query($squery);
echo "success";
?>