<?php

/**
 * This file centralizes the PDO instance for the entire application.
 */

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/**
 * Database connection handler using environment variables.
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

/**
 * Executes a SELECT query and returns all results.
 */
function fetchAll($sql, $params = []) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Executes an INSERT, UPDATE, or DELETE query.
 * Returns the number of affected rows or the last inserted ID.
 */
function executeQuery($sql, $params = []) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // If it's an INSERT, we might want the new ID
    if (stripos($sql, 'INSERT') === 0) {
        return $pdo->lastInsertId();
    }
    
    return $stmt->rowCount();
}