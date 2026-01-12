<?php

/**
 * StudioSync API Entry Point
 * Test database connectivity
 */

$host = getenv('DB_HOST');
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');

try {
    $dsn = "pgsql:host=$host;dbname=$db;";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // Success message in English as requested
    echo json_encode(["status" => "success", "message" => "Securely connected to Database"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
}