"use client";

import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../config/api';
import NotificationModal from '../components/NotificationModal';

interface Client {
  id?: number;
  company_name: string;
  vat_number: string;
  email: string;
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'confirm' as 'confirm' | 'alert' | 'success',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  // Selection/Form states
  const [newClient, setNewClient] = useState<Client>({ company_name: '', vat_number: '', email: '' });

  
  // Handlers
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(ENDPOINTS.CLIENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      
      const result = await response.json();

      if (result.status === 'success') {
        setIsAddModalOpen(false);
        setNewClient({ company_name: '', vat_number: '', email: '' });
        fetchClients();
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleDeleteClick = (id: number) => {
    console.log('Deleting client with ID:', id);

    if (id === null) return;

    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Client',
      message: 'Are you sure you want to remove this client?',
      onConfirm: () => confirmDelete(id)
    });
  };

  // Functions
  const confirmDelete = async (id: number) => {
    console.log('Deleting client with ID:', id);

    if (id === null) return;

    try {
      const response = await fetch(ENDPOINTS.CLIENT_DELETE(id), {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status === 'success') {
        setModalConfig({...modalConfig, isOpen: false});
        fetchClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(ENDPOINTS.CLIENTS);
      const result = await response.json();
      if (result.status === 'success') setClients(result.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // Renderer
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">StudioSync</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-indigo-700 transition cursor-pointer"
          >
            + New Client
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-700">Company</th>
                <th className="p-4 text-sm font-semibold text-slate-700">VAT Number</th>
                <th className="p-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="p-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-slate-900 font-medium">{client.company_name}</td>
                  <td className="p-4 text-slate-500 text-sm">{client.vat_number}</td>
                  <td className="p-4 text-slate-500 text-sm">{client.email}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { handleDeleteClick(client.id!) }}
                      className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer transition-colors p-2 rounded-md hover:bg-rose-50"
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

      {/* Add client modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Register New Client</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newClient.company_name}
                  onChange={(e) => setNewClient({...newClient, company_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">VAT Number</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newClient.vat_number}
                  onChange={(e) => setNewClient({...newClient, vat_number: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <NotificationModal 
        {...modalConfig} 
        onClose={() => setModalConfig({...modalConfig, isOpen: false})} 
      />

    </main>
  );
}