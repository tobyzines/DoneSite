
<?php
$table_name = $_GET['table_name'];
//printf("Table name is " . $table_name);
$con = mysqli_connect('localhost','done','done','done_db');
if (mysqli_connect_errno()) {
    die('Could not connect: ' . mysqli_connect_error());
}

//mysqli_select_db($con,"done_db");
$sql="SELECT * FROM " . $table_name;
if ($result = mysqli_query($con,$sql)) {
	//printf("Made a successful call");
} else { printf("Something went wrong");}

$to_return = array();
echo "[";
$row = mysqli_fetch_array($result);
echo $row['details'];
 
while($row = mysqli_fetch_array($result)) {
    //array_push($to_return, "$row['details']");
	echo "," . $row['details'];
}
echo "]";
//echo json_encode($to_return);
mysqli_free_result($result);
mysqli_close($con);
?>