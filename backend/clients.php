<?php
/**
 * Clients REST Controller
 * Handles CRUD operations for the clients table.
 */
require_once 'db.php';

// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Fetch all clients
            $sql = "SELECT * FROM clients ORDER BY created_at DESC";
            $data = fetchAll($sql);
            echo json_encode(["status" => "success", "data" => $data]);
            break;

        case 'POST':
            // Create or Update
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (isset($input['id']) && !empty($input['id'])) {
                // UPDATE
                $sql = "UPDATE clients SET company_name = ?, vat_number = ?, email = ? WHERE id = ?";
                executeQuery($sql, [$input['company_name'], $input['vat_number'], $input['email'], $input['id']]);
                echo json_encode(["status" => "success", "message" => "Client updated successfully"]);
            } else {
                // CREATE
                $sql = "INSERT INTO clients (company_name, vat_number, email) VALUES (?, ?, ?)";
                $newId = executeQuery($sql, [$input['company_name'], $input['vat_number'], $input['email']]);
                echo json_encode(["status" => "success", "message" => "Client created", "id" => $newId]);
            }
            break;

        case 'DELETE':
            // Delete client (usually ID is passed as a query parameter: clients.php?id=1)
            if (isset($_GET['id'])) {
                $sql = "DELETE FROM clients WHERE id = ?";
                executeQuery($sql, [$_GET['id']]);
                echo json_encode(["status" => "success", "message" => "Client deleted"]);
            } else {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Missing client ID"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}