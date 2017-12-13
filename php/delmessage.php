<?php
$mysqli=new mysqli('localhost','root','root','test');
$squery="DELETE from message where title='{$_GET[asd]}'";
$mysqli->query($squery);
echo "success";
?>