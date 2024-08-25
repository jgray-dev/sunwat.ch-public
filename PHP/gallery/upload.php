<?php


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if an image was uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES['image'];
        $imageName = basename($image['name']);
        $uploadPath = __DIR__ . '/uploads/' . $imageName;

        // Move the uploaded image to the uploads folder
        if (move_uploaded_file($image['tmp_name'], $uploadPath)) {
            // Send a success response with the image URL
            http_response_code(200);
            echo '/uploads/' . $imageName;
        } else {
            // Handle upload error
            http_response_code(500);
            echo 'Error uploading image';
        }
    } else {
        // Handle no image upload
        http_response_code(400);
        echo 'No image uploaded';
    }
} else {
    // Handle invalid request method
    http_response_code(405);
    echo 'Invalid request method';
}