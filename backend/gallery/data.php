<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $deleteData = json_decode(file_get_contents('php://input'), true);
    if ($deleteData === null) {
        http_response_code(400); // Bad Request
        echo json_encode(array("error" => "Invalid JSON data received"));
        exit; // Stop execution
    }
    // Find the index of the object in the array
    $index = array_search($deleteData, $jsonArray);
    if ($index !== false) {
        // Get the image URL from the object
        $imageUrl = $jsonArray[$index]['imageUrl'];
        // Extract the image filename from the URL
        $imagePath = parse_url($imageUrl, PHP_URL_PATH);
        $imageFilename = basename($imagePath);
        // Remove the object from the array
        array_splice($jsonArray, $index, 1);
        $jsonData = json_encode($jsonArray);
        file_put_contents('data.json', $jsonData);
        // Delete the associated image file
        $imagePath = __DIR__ . '/uploads/' . $imageFilename;
        if (file_exists($imagePath)) {
            unlink($imagePath);
            http_response_code(200); // OK
            echo json_encode(array("message" => "Data and associated image deleted successfully"));
        } else {
            http_response_code(200); // OK
            echo json_encode(array("message" => "Data deleted successfully, but associated image not found"));
        }
    } else {
        http_response_code(404); // Not Found
        echo json_encode(array("error" => "Object not found"));
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method not allowed"));
}