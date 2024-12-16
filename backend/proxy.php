<?php
// Define your API key
$apiKey = 'undefined';

// Check if the 'url' parameter is set and not empty
if (isset($_GET['url']) && !empty($_GET['url'])) {
    $url = $_GET['url'];
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Missing or empty URL parameter']);
    exit;
}

if (str_contains($url, 'accuweather')) {
    $apiKey = 'lol-nah';
}

if (str_contains($url, 'windy')) {
    $options = array(
        'http' => array(
            'header' => "x-windy-api-key: lol-nah"
        )
    );
    $context = stream_context_create($options);
}

// Replace "${key}" in the URL with the actual API key
$requestUrl = str_replace('REPLACEWITHAPIKEY', $apiKey, $url);

// Fetch data from the actual API
if (str_contains($url, 'windy')) {
    $response = file_get_contents($requestUrl, false, $context);
} else {
    $response = file_get_contents($requestUrl);
}

// Check if the API request was successful
if ($response === false) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Failed to fetch data from API']);
    exit;
}

// Set the appropriate headers and echo the JSON response
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo $response;
