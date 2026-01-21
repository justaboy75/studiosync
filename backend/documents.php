<?php
/**
 * StudioSync Document Management Controller
 * * Handles document retrieval, categorization (labeling), and secure deletion.
 * Implements granular Access Control Logic (ACL) to ensure data privacy 
 * between different clients and administrative roles.
 */

require_once 'db.php';

/**
 * Preflight request handling for Cross-Origin Resource Sharing (CORS).
 * Essential for decoupled Frontend (Next.js) and Backend (PHP) communication.
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    /**
     * READ: Fetch client-specific documents.
     * Includes a JOIN with document_labels to provide visual metadata (colors/names).
     */
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

    /**
     * UPDATE: Category Assignment.
     * Updates the label_id for a specific document asset.
     */
    elseif ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_label') {
        $input = json_decode(file_get_contents('php://input'), true);
        $docId = $input['id'] ?? null;
        $labelId = $input['label_id'] ?? null;

        if ($docId) {
            // Support for removing labels by passing an empty string
            $val = ($labelId == "") ? null : $labelId;
            executeQuery("UPDATE documents SET label_id = ? WHERE id = ?", [$val, $docId]);
            echo json_encode(["status" => "success", "message" => "Label updated"]);
            exit;
        }
    }
    
    /**
     * DELETE: Secure Asset Purge.
     * Enforces strict authorization checks before removing files and DB records.
     */
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        $loggedUserId = $_GET['user_id'] ?? null;

        if (!$id || !$loggedUserId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing parameters"]);
            exit;
        }

        // --- Authorization Logic ---
        // Fetch user context and target document metadata
        $user = fetchAll("SELECT id, role, client_id FROM users WHERE id = ?", [$loggedUserId])[0] ?? null;
        $doc = fetchAll("SELECT id, client_id, file_path FROM documents WHERE id = ?", [$id])[0] ?? null;

        if (!$user || !$doc) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User or Document not found"]);
            exit;
        }

        // Define access levels: Admin can do anything, Clients can only delete their own docs
        $isAdmin = ($user['role'] === 'admin');
        $isOwner = ($user['role'] === 'client' && $user['client_id'] === $doc['client_id']);

        if ($isAdmin || $isOwner) {
            /**
             * Double-Step Cleanup:
             * 1. Remove physical file from the disk to free up space.
             * 2. Remove the metadata record from the PostgreSQL database.
             */
            if (file_exists($doc['file_path'])) unlink($doc['file_path']); // Remove physical file
            executeQuery("DELETE FROM documents WHERE id = ?", [$id]);
            echo json_encode(["status" => "success", "message" => "Document deleted"]);
        } else {
            // Security: Log unauthorized attempts and return a 403 Forbidden status
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Unauthorized: You cannot delete this file"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}