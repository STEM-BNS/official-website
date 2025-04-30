<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require_once 'config.php';

// Test database connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Database connection successful!<br>";
}

// Test if events table exists
$result = $conn->query("SHOW TABLES LIKE 'events'");
if ($result->num_rows > 0) {
    echo "Events table exists!<br>";
} else {
    echo "Events table does not exist.<br>";
}

// Display database name and connection info
echo "<br>Database Info:<br>";
echo "Database name: " . $db_name . "<br>";
echo "Host: " . $db_host . "<br>";
echo "User: " . $db_user . "<br>";

$conn->close();
?> 