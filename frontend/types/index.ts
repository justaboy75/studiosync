// Represent a client 
export interface Client {
  id?: number;
  company_name: string;
  vat_number: string;
  email: string;
  created_at: string;
}

// Represent a document
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

// Rappresent a logged user
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'client';
  client_id: number | null;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Represent a document category/label
export interface DocumentLabel {
  id: number;
  name: string;
  color_code: string;
}