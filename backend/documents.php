<?php

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $clientId = $_GET['client_id'] ?? null;
        $sql = "
            SELECT d.*, l.name as label_name, l.color_code as label_color 
            FROM documents d 
            LEFT JOIN document_labels l ON d.label_id = l.id 
            WHERE d.client_id = ? 
            ORDER BY d.created_at DESC
        ";
        $data = fetchAll($sql, [$clientId]);
        echo json_encode(["status" => "success", "data" => $data]);
    }

    elseif ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_label') {
        $input = json_decode(file_get_contents('php://input'), true);
        $docId = $input['id'] ?? null;
        $labelId = $input['label_id'] ?? null;

        if ($docId) {
            $val = ($labelId == "") ? null : $labelId;
            executeQuery("UPDATE documents SET label_id = ? WHERE id = ?", [$val, $docId]);
            echo json_encode(["status" => "success", "message" => "Label updated"]);
            exit;
        }
    }
    
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        $loggedUserId = $_GET['user_id'] ?? null;

        if (!$id || !$loggedUserId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing parameters"]);
            exit;
        }

        $user = fetchAll("SELECT id, role, client_id FROM users WHERE id = ?", [$loggedUserId])[0] ?? null;
        $doc = fetchAll("SELECT id, client_id, file_path FROM documents WHERE id = ?", [$id])[0] ?? null;

        if (!$user || !$doc) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User or Document not found"]);
            exit;
        }

        $isAdmin = ($user['role'] === 'admin');
        $isOwner = ($user['role'] === 'client' && $user['client_id'] === $doc['client_id']);

        if ($isAdmin || $isOwner) {
            if (file_exists($doc['file_path'])) unlink($doc['file_path']); // Remove physical file
            executeQuery("DELETE FROM documents WHERE id = ?", [$id]);
            echo json_encode(["status" => "success", "message" => "Document deleted"]);
        } else {
            // Unauthorized
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Unauthorized: You cannot delete this file"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}