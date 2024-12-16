<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
$jsonData = file_get_contents('changelog.json');
$jsonArray = json_decode($jsonData, true);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo $jsonData;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    $jsonArray[] = $postData;
    $jsonData = json_encode($jsonArray);
    file_put_contents('changelog.json', $jsonData);
    http_response_code(201);
    echo json_encode(array("message" => "Data added successfully"));
}
