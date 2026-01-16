<?php
/**
 * Clients REST Controller
 * Handles CRUD operations for the clients table.
 */
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'OPTIONS':
            // Preflight request handling
            http_response_code(200);
            exit;

        case 'GET':
            // Fetch all clients
            $sql = "SELECT clients.*, users.username FROM clients LEFT JOIN users ON clients.id = users.client_id ORDER BY created_at DESC";
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

                if ($newId) {
                    $tempPassword = bin2hex(random_bytes(4)); // Short tempoorary password (e.g. "a1b2c3d4")
                    $hashedPass = password_hash($tempPassword, PASSWORD_BCRYPT);
                    
                    executeQuery(
                        "INSERT INTO users (username, password_hash, role, client_id, is_active) VALUES (?, ?, 'client', ?, FALSE)",
                        [$input['username'], $hashedPass, $newId]
                    );

                    echo json_encode([
                        "status" => "success", 
                        "message" => "Client created",
                        "id" => $newId,
                        "temp_credentials" => [
                            "username" => $input['username'],
                            "password" => $tempPassword
                        ]
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "Error creating new client"]);
                }
            }
            break;

        case 'DELETE':
            // Delete client by id
            if (isset($_GET['id'])) {
                
                // Delete client's associated subfolders/files in upload folder
                $clientFolder = "uploads/client_" . $_GET['id'];
                deleteDirectory($clientFolder);

                // Delete client record from database and related document records
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