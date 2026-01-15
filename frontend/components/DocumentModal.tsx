"use client";
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';
import NotificationModal from './NotificationModal';

export default function DocumentsModal({ isOpen, onClose, clientId, clientName }: any) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    docId: null as number | null,
    docName: ''
  });

  const fetchDocs = async () => {
    const res = await fetch(`${ENDPOINTS.DOCUMENTS}?client_id=${clientId}`);
    const result = await res.json();
    if (result.status === 'success') setDocuments(result.data);
  };

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

  // Drag & Drop Handlers
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

  const handleDeleteRequest = (id: number, name: string) => {
    setConfirmConfig({
      isOpen: true,
      docId: id,
      docName: name
    });
  };

  const confirmDelete = async () => {
    if (!confirmConfig.docId) return;
    
    try {
      const res = await fetch(`${ENDPOINTS.DOCUMENTS}?id=${confirmConfig.docId}`, { 
        method: 'DELETE' 
      });
      const result = await res.json();
      if (result.status === 'success') {
        setConfirmConfig({ ...confirmConfig, isOpen: false });
        fetchDocs();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => { 
    if (isOpen) {
        fetchDocs();
        fetchLabels();
    } 
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in duration-150">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Document Archive</h3>
            <p className="text-sm text-slate-500">{clientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">✕</button>
        </div>

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
                      onClick={() => handleDeleteRequest(doc.id, doc.original_name)}
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

        {/* Confirm Delete Modal */}
        <NotificationModal 
          isOpen={confirmConfig.isOpen}
          type="confirm"
          title="Delete Document"
          message={`Are you sure you want to permanently delete "${confirmConfig.docName}"?`}
          onConfirm={confirmDelete}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        />

      </div>
    </div>
  );
}