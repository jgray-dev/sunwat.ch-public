<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$jsonData = file_get_contents('data.json');
$jsonArray = json_decode($jsonData, true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo $jsonData;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    if ($postData === null) {
        http_response_code(400); // Bad Request
        echo json_encode(array("error" => "Invalid JSON data received"));
        exit; // Stop execution
    }

    // Add the new data to the existing array
    $jsonArray[] = $postData;
    $jsonData = json_encode($jsonArray);
    file_put_contents('data.json', $jsonData);

    http_response_code(201); // Created
    echo json_encode(array("message" => "Data added successfully"));
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method not allowed"));
}