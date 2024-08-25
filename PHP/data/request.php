<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
$jsonData = file_get_contents('data.json'); // Set a PHP variable to our JSON data
$jsonArray = json_decode($jsonData, true); // Decode our JSON file into a PHP array
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo $jsonData; // Echo our JSON data on GET request
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $postData = json_decode(file_get_contents('php://input'), true); // Decode our input into a PHP array
  $jsonArray[] = $postData; // Append our new array to our old array
  $jsonData = json_encode($jsonArray); // Re-encode our complete data
  file_put_contents('data.json', $jsonData); // Place the data back into our data.json file

  http_response_code(201);
  echo json_encode(array("message" => "Data added successfully"));
}



