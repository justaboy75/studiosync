<?php

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$user = $input['username'] ?? '';
$pass = $input['password'] ?? '';

$sql = "SELECT id, username, password_hash, role, client_id FROM users WHERE username = ?";
$userData = fetchAll($sql, [$user])[0] ?? null;

if ($userData && password_verify($pass, $userData['password_hash'])) {
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $userData['id'],
            "role" => $userData['role'],
            "client_id" => $userData['client_id']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}