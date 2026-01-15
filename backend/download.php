<?php

require_once 'db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    die("Missing document ID");
}

try {
    $doc = fetchAll("SELECT * FROM documents WHERE id = ?", [$id])[0] ?? null;

    if ($doc && file_exists($doc['file_path'])) {
        // Download headers
        header('Content-Description: File Transfer');
        header('Content-Type: ' . $doc['file_type']);
        header('Content-Disposition: attachment; filename="' . $doc['original_name'] . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . $doc['file_size']);
        
        readfile($doc['file_path']);
        exit;
    } else {
        http_response_code(404);
        die("File not found");
    }
} catch (Exception $e) {
    http_response_code(500);
    die("Server error");
}