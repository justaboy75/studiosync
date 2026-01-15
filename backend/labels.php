<?php

require_once 'db.php';

try {
    $labels = fetchAll("SELECT * FROM document_labels ORDER BY name ASC");
    echo json_encode(["status" => "success", "data" => $labels]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}