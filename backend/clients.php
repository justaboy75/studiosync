<?php
/**
 * StudioSync Clients REST Controller
 * * Orchestrates CRUD operations for professional clients.
 * Manages synchronized lifecycle between 'clients' and 'users' entities,
 * including secure credential generation and filesystem cleanup.
 */

require_once 'db.php';

// Extract the HTTP interface method
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'OPTIONS':
            /**
             * Preflight request handling for Cross-Origin Resource Sharing (CORS).
             * Essential for decoupled Frontend (Next.js) and Backend (PHP) communication.
             */
            http_response_code(200);
            exit;

        case 'GET':
            /**
             * READ: Retrieves a comprehensive list of clients.
             * Performs a LEFT JOIN with the users table to provide account status/identity.
             */
            $sql = "SELECT clients.*, users.username FROM clients LEFT JOIN users ON clients.id = users.client_id ORDER BY created_at DESC";
            $data = fetchAll($sql);
            echo json_encode(["status" => "success", "data" => $data]);
            break;

        case 'POST':
            /**
             * CREATE / UPDATE: Processes incoming JSON payload.
             * Implements an 'upsert' logic based on the presence of a client ID.
             */
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (isset($input['id']) && !empty($input['id'])) {
                // UPDATE: Modify existing client record
                $sql = "UPDATE clients SET company_name = ?, vat_number = ?, email = ? WHERE id = ?";
                executeQuery($sql, [$input['company_name'], $input['vat_number'], $input['email'], $input['id']]);
                echo json_encode(["status" => "success", "message" => "Client updated successfully"]);
            } else {
                // CREATE: Initialize new client entity and associated user account
                $sql = "INSERT INTO clients (company_name, vat_number, email) VALUES (?, ?, ?)";
                $newId = executeQuery($sql, [$input['company_name'], $input['vat_number'], $input['email']]);

                if ($newId) {
                    /**
                     * Automated Onboarding:
                     * 1. Generate a secure 8-character temporary password.
                     * 2. Hash credentials using industry-standard BCRYPT.
                     * 3. Set account as 'inactive' until the first professional review.
                     */
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
            /**
             * DELETE: Full entity removal.
             * Ensures 'Right to be Forgotten' by deleting both database records 
             * and physical document assets stored on the disk.
             */
            if (isset($_GET['id'])) {
                
                // Physical file system cleanup
                $clientFolder = "uploads/client_" . $_GET['id'];
                deleteDirectory($clientFolder);

                // Relational data removal (Cascade delete handled via code/DB constraints)
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