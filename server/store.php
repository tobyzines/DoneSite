<?php
class Db {
    // The database connection
    protected static $connection;

    /**
     * Connect to the database
     * 
     * @return bool false on failure / mysqli MySQLi object instance on success
     */
    public function connect() {    
        // Try and connect to the database
        if(!isset(self::$connection)) {
            // Load configuration as an array. Use the actual location of your configuration file
            $config = parse_ini_file('./config.ini'); 
            self::$connection = new mysqli('localhost',$config['username'],$config['password'],$config['dbname']);
        }

        // If connection was not successful, handle the error
        if(self::$connection === false) {
            // Handle error - notify administrator, log to a file, show an error screen, etc.
            return false;
        }
        return self::$connection;
    }

    /**
     * Query the database
     *
     * @param $query The query string
     * @return mixed The result of the mysqli::query() function
     */
    public function query($query) {
        // Connect to the database
        $connection = $this -> connect();

        // Query the database
        $result = $connection -> query($query);

        return $result;
    }

    /**
     * Fetch rows from the database (SELECT query)
     *
     * @param $query The query string
     * @return bool False on failure / array Database rows on success
     */
    public function select($query) {
        $rows = array();
        $result = $this -> query($query);
        if($result === false) {
            return false;
        }
        while ($row = $result -> fetch_assoc()) {
            $rows[] = $row;
        }
        return $rows;
    }

    /**
     * Fetch the last error from the database
     * 
     * @return string Database error message
     */
    public function error() {
        $connection = $this -> connect();
        return $connection -> error;
    }
	
	public function close() {
		if(isset(self::$connection)) {} 
			mysqli_close(self::$connection);
	}

    /**
     * Quote and escape value for use in a database query
     *
     * @param string $value The value to be quoted and escaped
     * @return string The quoted and escaped string
     */
    public function quote($value) {
        $connection = $this -> connect();
        return "'" . $connection -> real_escape_string($value) . "'";
    }
}

$db = new Db();    

if (mysqli_connect_errno()) {
    die('Could not connect: ' . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
     $table_name = $_GET['table_name'];
	//printf("Table name is " . $table_name);
	
	
	$sql="SELECT * FROM " . $table_name;
	if ($result = $db -> query($sql)) {
		//printf("Made a successful call");
	} else { printf("Something went wrong");}
	
	echo "[";
	$row = mysqli_fetch_array($result);
	echo $row['details'];
	 
	while($row = mysqli_fetch_array($result)) {
	    echo "," . $row['details'];
	}
	echo "]";
	mysqli_free_result($result);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     // The request is using the GET method
	$json = file_get_contents('php://input');
	$dataObject = json_decode($json);

	$table_name = $dataObject->{'table_name'};
	
	// TBD check table name is a valid name to protect against SQL injection
	$data_to_update = $dataObject->{'object_to_update'};
	printf("Data to update is " . $data_to_update . "_end_");
	
	$actual_object = json_decode($data_to_update);
	
	// figure out what field has the object name in it
	$array = (array)$actual_object;
	$keys = array_keys($array);
	$objectName = 'NoNameFound';
	for ($i = 0; $i < count($keys); $i++) {
		if (strpos($keys[$i], 'Name') !== FALSE) {
		   $objectName = $actual_object->{$keys[$i]};
		   break;
		}
	}
	
	// TBD replace this with PDO to protect from SQL injection
	$sql="insert into " . $table_name . "(name, details) values ('" . $objectName . "', " . $db -> quote($data_to_update) . ")";
	
	if ($result = $db -> query($sql)) {
	  printf("Success - added " . $objectName . " to db");
	} else {
		printf ("Failed to add to db - " . $db->error());
	}
}

$db -> close();
?>