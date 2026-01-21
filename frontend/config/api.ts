/**
 * StudioSync API Configuration
 * * Centralizes all backend interaction points.
 * Uses environment-specific base URLs to ensure seamless transitions
 * between Development, Staging, and Production environments.
 */

// Global API Gateway from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API Service Map
 * * Static endpoints handle standard CRUD operations.
 * * Dynamic functions handle parameterized requests for specific resources.
 */
export const ENDPOINTS = {
  // --- Core Authentication & Setup ---
  LOGIN: `${API_BASE_URL}/login.php`,
  SETUP_PASSWORD: `${API_BASE_URL}/setup_password.php`,

  // --- Entity Management (CRUD) ---
  CLIENTS: `${API_BASE_URL}/clients.php`,

  // --- Document Handling & Processing ---
  UPLOAD: `${API_BASE_URL}/upload.php`,
  DOCUMENTS: `${API_BASE_URL}/documents.php`,
  LABELS: `${API_BASE_URL}/labels.php`,
  UPDATE_DOC_LABEL: `${API_BASE_URL}/documents.php?action=update_label`,
  

  /**
   * Resource-Specific Handlers (Parameterized)
   */
  
  // Admin: Delete client and associated storage
  CLIENT_DELETE: (id: number | string) => `${API_BASE_URL}/clients.php?id=${id}`,
  
  // Security: Requires both Asset ID and User ID for server-side ACL validation
  DOC_DELETE: (id: number | string, user_id: number | null) => `${API_BASE_URL}/documents.php?id=${id}&user_id=${user_id}`,
  
  // Streaming: Secure document retrieval
  DOWNLOAD: (id: number) => `${API_BASE_URL}/download.php?id=${id}`,
};