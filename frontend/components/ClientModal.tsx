"use client";
import { useState, useEffect } from 'react';
import { Client } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  initialData?: Client | null; // If present, we are in EDIT mode
}

export default function ClientModal({ isOpen, onClose, onSave, initialData }: ClientModalProps) {
  const [formData, setFormData] = useState<Client>({
    company_name: '',
    vat_number: '',
    email: '',
    username: '',
    created_at: ''
  });

  // Sync state with initialData when it changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ company_name: '', vat_number: '', email: '', username: '', created_at: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {initialData ? 'Edit Client' : 'Register New Client'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input 
              required
              type="text" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">VAT Number</label>
            <input 
              required
              type="text" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.vat_number}
              onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              required={!initialData}
              type="text" 
              disabled={initialData ? true : false}
              className={`w-full p-2.5 border rounded-lg outline-none transition-all ${initialData ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'}`}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            {initialData && (
              <p className="text-xs text-slate-400 mt-1">
                Username cannot be changed after creation.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer shadow-sm transition"
            >
              {initialData ? 'Update Changes' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}