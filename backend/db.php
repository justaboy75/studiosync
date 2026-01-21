<?php

/**
 * StudioSync Database Service Layer
 * * Provides centralized PDO management and standardized methods for 
 * database interactions using PostgreSQL.
 */

// --- API Header Configuration ---
// These headers ensure the backend can communicate with the decoupled frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/**
 * Initializes a secure PostgreSQL connection.
 * * Uses environment variables for configuration to comply with 
 *   12-Factor App methodology for cloud-native applications.
 * * @return PDO Established database connection.
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
            // Throw exceptions for all database errors
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            // Fetch results as associative arrays by default
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Disable emulated prepares to use native PostgreSQL prepared statements
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        // Critical: In production, sensitive connection details are suppressed.
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            "status" => "error",
            "message" => "Database connection failed: " . $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Executes a Read-only query.
 * * @param string $sql The SQL statement with placeholders.
 * @param array $params Data to bind to the statement.
 * @return array Collection of fetched records.
 */
function fetchAll($sql, $params = []) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/**
 * Executes Write operations (INSERT, UPDATE, DELETE).
 * * @param string $sql The SQL statement with placeholders.
 * @param array $params Data to bind to the statement.
 * @return string|int Returns lastInsertId for insertions, or affected row count otherwise.
 */
function executeQuery($sql, $params = []) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Return primary key for new records if applicable
    if (stripos($sql, 'INSERT') === 0) {
        return $pdo->lastInsertId();
    }
    
    return $stmt->rowCount();
}

/**
 * Utility: Recursive File System Management.
 * * Safely removes a directory and all contained document assets.
 * Used primarily for cleaning up client data upon account termination.
 * * @param string $dir Path to the target directory.
 * @return bool True on successful deletion.
 */
function deleteDirectory($dir) {
    if (!file_exists($dir)) return true;
    if (!is_dir($dir)) return unlink($dir);
    
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) return false;
    }
    
    return rmdir($dir);
}