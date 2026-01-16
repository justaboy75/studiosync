<?php

// backend/setup-password.php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? null;
$newPass = $data['new_password'] ?? null;

if (!$userId || !$newPass || strlen($newPass) < 8) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit;
}

$hashedPassword = password_hash($newPass, PASSWORD_BCRYPT);

$success = executeQuery(
    "UPDATE users SET password_hash = ?, is_active = TRUE WHERE id = ?", 
    [$hashedPassword, $userId]
);

if ($success) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}