/**
 * API Configuration
 * Centralized endpoints with parameter support.
 */

const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  // Base endpoints
  CLIENTS: `${API_BASE_URL}/clients.php`,
  UPLOAD: `${API_BASE_URL}/upload.php`,
  DOCUMENTS: `${API_BASE_URL}/documents.php`,
  LABELS: `${API_BASE_URL}/labels.php`,
  UPDATE_DOC_LABEL: `${API_BASE_URL}/documents.php?action=update_label`,

  // Parameterized endpoints
  CLIENT_DELETE: (id: number | string) => `${API_BASE_URL}/clients.php?id=${id}`,
  DOWNLOAD: (id: number) => `${API_BASE_URL}/download.php?id=${id}`,
};