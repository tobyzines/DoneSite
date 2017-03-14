<html>
<head>
<title>Connecting MySQL Server</title>
</head>
<body>
<?php
   $dbhost = 'localhost:3306';
   $dbuser = 'admin';
   $dbpass = 'admin';
   $conn = mysql_connect($dbhost, $dbuser, $dbpass);
   if(! $conn )
   {
     die('Could not connect: ' . mysql_error());
   }
   echo 'Connected successfully';
   mysql_select_db( 'mysql' );
   mysql_close($conn);
?>
</body>
</html>