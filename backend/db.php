<?php

/**
 * Database connection handler using environment variables.
 * This file centralizes the PDO instance for the entire application.
 */

function getDatabaseConnection() {
    $host = getenv('DB_HOST');
    $db   = getenv('DB_NAME');
    $user = getenv('DB_USER');
    $pass = getenv('DB_PASS');
    $port = getenv('DB_PORT');

    try {
        $dsn = "pgsql:host=$host;port=$port;dbname=$db;";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        // In production, log the error instead of displaying it
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            "status" => "error",
            "message" => "Database connection failed: " . $e->getMessage()
        ]);
        exit;
    }
}