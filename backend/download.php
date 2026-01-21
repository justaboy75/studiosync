<?php
/**
 * StudioSync Document Download Service
 * * Facilitates secure file streaming from the private storage layer to the client.
 * Handles binary data transfer using appropriate HTTP headers to preserve
 * file integrity and original naming conventions.
 */

require_once 'db.php';

// Retrieve unique asset identifier
$id = $_GET['id'] ?? null;

if (!$id) {
    // Return early if no identifier is provided
    http_response_code(400);
    die("Error: Missing document identifier");
}

try {
    /**
     * Asset Retrieval Logic
     * Fetches metadata to reconstruct the file's original identity for the user.
     */
    $doc = fetchAll("SELECT * FROM documents WHERE id = ?", [$id])[0] ?? null;

    if ($doc && file_exists($doc['file_path'])) {
        /**
         * HTTP Streaming Headers
         * Configures the browser to handle the incoming stream as a file download.
         */
        header('Content-Description: File Transfer');
        // Set MIME type based on the database record
        header('Content-Type: ' . $doc['file_type']);
        // Force download and restore the original filename for the user
        header('Content-Disposition: attachment; filename="' . $doc['original_name'] . '"');
        
        // Cache management for secure document delivery
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');

        // Inform the client of the total byte size to enable progress bars
        header('Content-Length: ' . $doc['file_size']);
        
        /**
         * Stream Output
         * Reads the file from secure storage and sends it to the output buffer.
         */
        readfile($doc['file_path']);
        exit;
    } else {
        // Handle missing physical files or invalid database references
        http_response_code(404);
        die("Error: Resource not found on the file system");
    }
} catch (Exception $e) {
    // Internal server error handling with generic output for security
    http_response_code(500);
    die("Error: Critical failure during document retrieval");
}