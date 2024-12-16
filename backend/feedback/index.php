<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$jsonData = file_get_contents('feedback.json');
$jsonArray = json_decode($jsonData, true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo $jsonData;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    $jsonArray[] = $postData;
    $jsonData = json_encode($jsonArray);
    file_put_contents('feedback.json', $jsonData);
    http_response_code(201);
    echo json_encode(array("message" => "Data added successfully"));
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $deleteData = json_decode(file_get_contents('php://input'), true);
    $stringToDelete = $deleteData['string'];
    
    $index = array_search($stringToDelete, $jsonArray);
    if ($index !== false) {
        array_splice($jsonArray, $index, 1);
        $jsonData = json_encode($jsonArray);
        file_put_contents('feedback.json', $jsonData);
        http_response_code(200);
        echo json_encode(array("message" => "Data deleted successfully"));
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "String not found"));
    }
}
