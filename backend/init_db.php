<?php
/**
 * Database Schema Initialization
 * Creates tables and seeds initial data for testing.
 */
require_once 'db.php';

try {
    // Create Clients Table
    $createTableSql = "CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        vat_number VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";
    
    executeQuery($createTableSql);

    // Seed Initial Data (only if table is empty)
    $checkEmpty = fetchAll("SELECT id FROM clients LIMIT 1");
    
    if (empty($checkEmpty)) {
        $seedSql = "INSERT INTO clients (company_name, vat_number, email) VALUES (?, ?, ?)";
        executeQuery($seedSql, ['Studio Rossi s.r.l.', 'IT12345678901', 'info@studiorossi.it']);
        executeQuery($seedSql, ['Tech Solutions Hub', 'IT98765432109', 'contact@techhub.com']);
        
        $message = "Database initialized and seeded with sample clients.";
    } else {
        $message = "Database already initialized. No seeding required.";
    }

    echo json_encode([
        "status" => "success",
        "message" => $message
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}