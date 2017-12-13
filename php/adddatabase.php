<?php
$mysqli=new mysqli('localhost','root','root','test');
$sql="INSERT INTO dataglk (name,src,duration,piao) VALUE ('{$_GET[name]}','{$_GET[src]}','{$_GET[duration]}','{$_GET[piao]}')";
$mysqli->query($sql);
echo $mysqli->insert_id;
?>