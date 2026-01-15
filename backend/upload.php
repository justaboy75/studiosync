<?php
/**
 * Document Upload Controller
 * Handles file saving and database reference.
 */
require_once 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clientId = $_POST['client_id'] ?? null;
    $file = $_FILES['document'] ?? null;

    if (!$clientId || !$file) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing data"]);
        exit;
    }

    // Prepare directory for the client in uploads
    $targetDir = "uploads/client_" . $clientId . "/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Assign a secure file name
    $originalName = $file['name'];
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $safeName = time() . "_" . bin2hex(random_bytes(8)) . "." . $extension;
    $targetFilePath = $targetDir . $safeName;

    // Move file to the target directory and save reference to DB
    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        try {
            $sql = "INSERT INTO documents (client_id, file_name, original_name, file_path, file_type, file_size) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            executeQuery($sql, [
                $clientId, 
                $safeName, 
                $originalName, 
                $targetFilePath, 
                $file['type'], 
                $file['size']
            ]);

            echo json_encode(["status" => "success", "message" => "File uploaded successfully"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
    }
}