<?php
/**
 * StudioSync Authentication Controller
 * * Manages secure user access by validating credentials against 
 * BCRYPT-hashed passwords stored in the PostgreSQL identity layer.
 */

require_once 'db.php';

// --- Preflight Check ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Inbound Payload Processing
 * Decodes JSON credentials from the frontend application.
 */
$input = json_decode(file_get_contents('php://input'), true);
$user = $input['username'] ?? '';
$pass = $input['password'] ?? '';

/**
 * Identity Verification Logic
 * 1. Fetch user metadata using parameterized queries (SQL Injection Prevention).
 * 2. Verify password integrity using timing-safe comparison.
 */
$sql = "SELECT id, username, password_hash, role, client_id, is_active FROM users WHERE username = ?";
$userData = fetchAll($sql, [$user])[0] ?? null;

// Validate existence and cryptographic hash match
if ($userData && password_verify($pass, $userData['password_hash'])) {
    /**
     * Authentication Success
     * Returns a tailored user context object for frontend state management.
     */
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $userData['id'],
            "username" => $userData['username'],
            "role" => $userData['role'],
            "client_id" => $userData['client_id'],
            "is_active" => (bool)$userData['is_active']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}