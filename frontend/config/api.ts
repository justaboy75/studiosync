/**
 * API Configuration
 * Centralized endpoints with parameter support.
 */

const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  // Base endpoints
  LOGIN: `${API_BASE_URL}/login.php`,
  CLIENTS: `${API_BASE_URL}/clients.php`,
  UPLOAD: `${API_BASE_URL}/upload.php`,
  DOCUMENTS: `${API_BASE_URL}/documents.php`,
  LABELS: `${API_BASE_URL}/labels.php`,
  UPDATE_DOC_LABEL: `${API_BASE_URL}/documents.php?action=update_label`,
  SETUP_PASSWORD: `${API_BASE_URL}/setup_password.php`,

  // Parameterized endpoints
  CLIENT_DELETE: (id: number | string) => `${API_BASE_URL}/clients.php?id=${id}`,
  DOC_DELETE: (id: number | string, user_id: number | null) => `${API_BASE_URL}/documents.php?id=${id}&user_id=${user_id}`,
  DOWNLOAD: (id: number) => `${API_BASE_URL}/download.php?id=${id}`,
};