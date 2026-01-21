<?php

/**
 * StudioSync Document Upload Controller
 * 
 * This script handles the secure ingestion of client documentation,
 * manages physical file storage with unique naming conventions,
 * and persists metadata into the PostgreSQL database.
 */

require_once 'db.php';

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate incoming payload
    $clientId = $_POST['client_id'] ?? null;
    $file = $_FILES['document'] ?? null;

    if (!$clientId || !$file) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing data"]);
        exit;
    }

    /**
     * Storage Logic
     * Create isolated directories for each client to ensure data organization.
     */
    $targetDir = "uploads/client_" . $clientId . "/";
    if (!file_exists($targetDir)) {
        // Create directory with appropriate permissions (recursive)
        mkdir($targetDir, 0777, true);
    }

    /**
     * File Security & Naming
     * Generate a unique, non-guessable filename to prevent Direct Object Reference attacks.
     */
    $originalName = $file['name'];
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $safeName = time() . "_" . bin2hex(random_bytes(8)) . "." . $extension;
    $targetFilePath = $targetDir . $safeName;

    /**
     * Persistence Layer
     * Move the temporary file to permanent storage and log metadata in Postgres.
     */
    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        try {
            $sql = "INSERT INTO documents (client_id, file_name, original_name, file_path, file_type, file_size) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            // executeQuery uses prepared statements to prevent SQL Injection
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