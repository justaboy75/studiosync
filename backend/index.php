<?php
/**
 * StudioSync API Gateway & Health Check
 * * This entry point serves as a diagnostic tool to verify the operational 
 * status of the application layers, including the PHP runtime and 
 * PostgreSQL connectivity.
 */

require_once 'db.php';

// Ensure the client receives data in standardized JSON format
header('Content-Type: application/json');

/**
 * Service Dependency Validation
 * Verifies that the persistence layer is reachable and authenticated.
 */
$pdo = getDatabaseConnection();

/**
 * System Status Response
 * Returns a heartbeat payload with server-side telemetry.
 */
echo json_encode([
    "status" => "success",
    "message" => "Welcome to StudioSync API",
    "database_status" => "connected",
    "timestamp" => date('Y-m-d H:i:s')
]);