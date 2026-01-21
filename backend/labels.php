<?php
/**
 * StudioSync Document Labels Controller
 * * Provides access to the taxonomy of document categories.
 * These labels allow for standardized classification across all 
 * client document assets (e.g., Invoices, Contracts, Receipts).
 */

require_once 'db.php';

try {
    /**
     * READ: Retrieve Global Taxonomies
     * Fetches all available labels for document categorization.
     * Sorted alphabetically to ensure a consistent User Experience (UX) 
     * in dropdowns and filter menus.
     */
    $labels = fetchAll("SELECT * FROM document_labels ORDER BY name ASC");
    echo json_encode(["status" => "success", "data" => $labels]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}