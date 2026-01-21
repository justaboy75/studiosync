/**
 * StudioSync Client Document Vault
 * * Managed interface for document ingestion and lifecycle.
 * Features:
 * - Reactive Drag & Drop zone with visual feedback.
 * - Real-time upload progress tracking via XHR.
 * - Dynamic metadata tagging (Labels).
 * - Secure binary streaming integration.
 */

import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';

export default function ClientView({ clientId, clientName, onDelete }: any) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  /**
   * REFRESH: Syncs the local document state with the backend.
   */
  const fetchDocs = async () => {
    const res = await fetch(`${ENDPOINTS.DOCUMENTS}?client_id=${clientId}`);
    const result = await res.json();
    if (result.status === 'success') setDocuments(result.data);
  };

  /**
   * TAXONOMY: Loads available document categories for the select menus.
   */
  const fetchLabels = async () => {
    const res = await fetch(ENDPOINTS.LABELS);
    const result = await res.json();
    if (result.status === 'success') setAvailableLabels(result.data);
  };

 
  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('client_id', clientId);

    try {
      const res = await fetch(ENDPOINTS.UPLOAD, { method: 'POST', body: formData });
      const result = await res.json();
      if (result.status === 'success') fetchDocs();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  /**
   * METADATA UPDATE: Updates the label_id for a specific asset.
   */
  const updateLabel = async (docId: number, labelId: string) => {
    try {
        await fetch(`${ENDPOINTS.DOCUMENTS}?action=update_label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: docId, label_id: labelId })
        });
        fetchDocs(); // Ricarica la lista per mostrare i dati aggiornati
    } catch (error) {
        console.error("Failed to update label", error);
    }
  };

  // --- Drag & Drop UX Handlers ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('client_id', clientId);

    const xhr = new XMLHttpRequest();
    
    // Progress event listener
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        fetchDocs();
      }
    };

    xhr.open('POST', `${ENDPOINTS.UPLOAD}`, true);
    xhr.send(formData);
  };

  /**
   * UTILITY: Human-readable file size conversion.
   */
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => { 
    fetchDocs();
    fetchLabels();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <header className="mb-8">
          <h2 className="text-xl font-bold text-slate-900">Your Document Archive, {clientName}</h2>
          <p className="text-slate-500 text-sm">Upload and manage your documents here</p>
        </header>
        
        {/* Upload Area with Drag & Drop */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`mb-8 p-10 border-2 border-dashed rounded-xl text-center transition-all ${
            isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <input type="file" onChange={(e) => e.target.files && uploadFile(e.target.files[0])} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer group">
            <div className="text-indigo-600 font-bold mb-2 group-hover:scale-110 transition-transform text-2xl">↑</div>
            <p className="text-slate-600 font-medium">
              {uploading ? 'Processing file...' : 'Drag & Drop files here or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-2 text-uppercase font-semibold">PDF, JPG, PNG (Max 10MB)</p>
          </label>
        </div>
        {uploading && (
          <div className="mt-4 w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-indigo-700">Uploading document...</span>
              <span className="text-sm font-medium text-indigo-700">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Enhanced Documents List */}
        <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white border-b border-slate-100">
              <tr className="text-[10px] uppercase text-slate-400 font-bold">
                <th className="pb-2">Name</th>
                <th className="pb-2">Size</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-slate-400 italic text-sm">No files uploaded yet.</td></tr>
              )}
              {documents.map(doc => (
                <tr key={doc.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 text-sm font-medium text-indigo-600 max-w-[200px] truncate">
                    <a 
                        href={ENDPOINTS.DOWNLOAD(doc.id)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline cursor-pointer"
                    >
                        {doc.original_name}
                    </a>
                  </td>
                  <td className="py-3 text-xs text-slate-500">
                    {formatSize(doc.file_size)}
                  </td>
                  <td className="py-3 text-xs text-slate-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <select 
                        value={doc.label_id || ""} 
                        onChange={(e) => updateLabel(doc.id, e.target.value)}
                        className="text-[11px] font-semibold bg-slate-100 border-none rounded-full px-2 py-1 cursor-pointer hover:bg-slate-200 transition-colors outline-none"
                        style={{ color: doc.label_color || '#64748b' }}
                    >
                        <option value="">No Label</option>
                        {availableLabels.map(label => (
                        <option key={label.id} value={label.id} className="text-slate-900">
                            {label.name}
                        </option>
                        ))}
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => onDelete(doc, fetchDocs)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}