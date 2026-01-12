<?php

/**
 * StudioSync API Entry Point
 * Test database connectivity
 */

$host = 'db'; 
$db   = 'studiosync_db';
$user = 'user_admin';
$pass = 'password_segreta';
$port = "5432";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db;";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "message" => "Connected to PostgreSQL successfully",
        "service" => "StudioSync API"
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $e->getMessage()
    ]);
}