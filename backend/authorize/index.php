<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
// Define an array of authorized IP addresses
$authorizedIPs = array('lol-nah', '::1');

// Get the IP address of the sender
$senderIP = $_SERVER['REMOTE_ADDR'];

// Check if the sender's IP address is authorized
if (!in_array($senderIP, $authorizedIPs)) {
    http_response_code(400);
    echo $_SERVER['REMOTE_ADDR'];
    exit;
}

// If the sender is authorized, echo "true"
echo "true";
?>
