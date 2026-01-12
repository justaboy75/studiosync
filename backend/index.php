<?php

/**
 * StudioSync API Entry Point
 * Test database connectivity
 */

require_once 'db.php';

header('Content-Type: application/json');

$pdo = getDatabaseConnection();

echo json_encode([
    "status" => "success",
    "message" => "Welcome to StudioSync API",
    "database_status" => "connected",
    "timestamp" => date('Y-m-d H:i:s')
]);