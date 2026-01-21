<?php
/**
 * StudioSync Account Activation Controller
 * * Finalizes the onboarding process by allowing users to set their permanent
 * password and activating their account within the system.
 */

require_once 'db.php';

// Parse incoming JSON payload
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? null;
$newPass = $data['new_password'] ?? null;

/**
 * Validation Logic
 * Enforces a minimum password length and ensures all required 
 * identifiers are present before proceeding with the cryptographic hash.
 */
if (!$userId || !$newPass || strlen($newPass) < 8) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Security constraint: Password must be at least 8 characters long."
    ]);
    exit;
}

/**
 * Password Hashing
 * Uses BCRYPT, the industry standard for secure, salted password storage.
 */
$hashedPassword = password_hash($newPass, PASSWORD_BCRYPT);

/**
 * Account Activation
 * Updates the credentials and sets 'is_active' to TRUE, 
 * granting the user full access to the platform.
 */
$success = executeQuery(
    "UPDATE users SET password_hash = ?, is_active = TRUE WHERE id = ?", 
    [$hashedPassword, $userId]
);

if ($success) {
    echo json_encode([
        "status" => "success",
        "message" => "Account activated successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Operational failure during account activation."
    ]);
}