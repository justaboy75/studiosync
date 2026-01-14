/**
 * API Configuration
 * Centralized endpoints with parameter support.
 */

const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  // Base endpoints
  CLIENTS: `${API_BASE_URL}/clients.php`,
  
  // Parameterized endpoints
  CLIENT_DELETE: (id: number | string) => `${API_BASE_URL}/clients.php?id=${id}`,
  
  // You can add more complex ones later
  // CLIENT_DOCS: (id: number) => `${API_BASE_URL}/documents.php?client_id=${id}`,
};