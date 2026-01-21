/**
 * StudioSync Type Definitions
 * Centralized interfaces to ensure type safety across the application.
 * Aligned with the PostgreSQL schema for seamless Backend-Frontend integration.
 */

/**
 * Represents a professional client entity.
 * Includes both business details and associated account metadata.
 */ 
export interface Client {
  id?: number;
  company_name: string;
  vat_number: string;
  email: string;
  username: string;
  created_at: string;
}

/**
 * Represents a document asset and its categorization metadata.
 * Reflects the JOIN operation between 'documents' and 'document_labels' tables.
 */
export interface DocumentFile {
  id: number;
  client_id: number;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  label_id: number | null;
  label_name?: string;
  label_color?: string;
  created_at: string;
}

/**
 * Represents the authenticated session state.
 * Roles dictate the Access Control Logic (ACL) within the UI.
 */
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'client';
  client_id: number | null; // Nullable for admin users
  is_active: boolean;       // Account status check
}

/**
 * Defines the Global Authentication Context.
 * Used by React Context/Provider to manage session lifecycle.
 */
export interface AuthContextType {
  user: User | null;
  /**
   * Persists user session and updates global state
   * @param userData User object received from login.php
   */
  login: (userData: User) => void;
  /**
   * Clears session data and redirects to login
   */
  logout: () => void;
  isLoading: boolean; // Prevents UI flicker during session rehydration
}

/**
 * Represents a taxonomy category for document organization.
 */
export interface DocumentLabel {
  id: number;
  name: string;
  color_code: string;
}