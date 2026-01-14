"use client";

import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../config/api';
import NotificationModal from '../components/NotificationModal';
import ClientModal from '../components/ClientModal';

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
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'confirm' as 'confirm' | 'alert' | 'success',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  
  // Handlers
  const handleSaveClient = async (clientData: Client) => {
    try {
      const response = await fetch(ENDPOINTS.CLIENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setIsClientModalOpen(false);
        fetchClients();
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        title: 'Error',
        message: 'Something went wrong while saving.',
        onConfirm: () => {}
      });
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
            onClick={() => { setSelectedClient(null); setIsClientModalOpen(true); }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-indigo-700 transition cursor-pointer"
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
                      onClick={() => { setSelectedClient(client); setIsClientModalOpen(true); }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold cursor-pointer transition-colors p-2 rounded-md hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => { handleDeleteClick(client.id!) }}
                      className="text-rose-600 hover:text-rose-800 text-sm font-semibold cursor-pointer transition-colors p-2 rounded-md hover:bg-rose-50"
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

      {/* Edit client modal */}
      <ClientModal 
        isOpen={isClientModalOpen}
        initialData={selectedClient}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
      />

      {/* Delete confirmation modal */}
      <NotificationModal 
        {...modalConfig} 
        onClose={() => setModalConfig({...modalConfig, isOpen: false})} 
      />

    </main>
  );
}