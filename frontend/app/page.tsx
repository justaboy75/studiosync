"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../config/api';
import { Client, User } from '../types';
import NotificationModal from '../components/NotificationModal';
import ClientModal from '../components/ClientModal';
import DocumentModal from '../components/DocumentModal';
import AdminView from '../components/AdminView';
import ClientView from '../components/ClientView';


export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'confirm' as 'confirm' | 'alert' | 'success',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const router = useRouter();

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('user');

    setIsClientModalOpen(false);
    setIsDocumentModalOpen(false);
    setSelectedClient(null);
    setClients([]);
    
    router.push('/login');
  };

  const handleSaveClient = async (clientData: Client | null) => {
    console.log("Saving client data:", clientData);

    try {
      const response = await fetch(ENDPOINTS.CLIENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      
      const result = await response.json();

      console.log("Save client response:", result);
      
      if (result.status === 'success') {
        setIsClientModalOpen(false);
        fetchClients();
        
        // New client created
        if(result.id) {
          setModalConfig({
            isOpen: true,
            type: 'success',
            title: 'New Client created',
            message: `Give these credentials to the client:<br><br><b>Username:</b> ${result.temp_credentials?.username} <br> <b>Password:</b> ${result.temp_credentials?.password}<br><br><i>The client will be asked to change it upon first login.</i>`,
            onConfirm: () => {
              setModalConfig(prev => ({ ...prev, isOpen: false }));    
            }
          });
        } 
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

  const handleDeleteClient = async (id: number | undefined) => {
    if (id === null || id === undefined) return;

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

  const handleDeleteDocument = async (docId: number, refreshCallback: () => void) => {
    if (!user) return;
    
    try {
      const res = await fetch(ENDPOINTS.DOC_DELETE(docId, user.id), {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result.status === 'success') {
        if (refreshCallback) refreshCallback();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Functions
  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: async () => {
        await action();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!isLoading && user && !user.is_active) {
      router.push('/setup-password');
    } else if (!storedUser) {
      router.push('/login');
    } else {
      fetchClients();
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null; // Avoid page flickering

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">StudioSync</h1>
            <p className="text-slate-500 text-sm font-medium">Logged in as {user.username} ({user.role})</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg hover:border-rose-100 transition-all cursor-pointer"
          >
            Logout
          </button>
        </header>

        {user.role === 'admin' ? (
          <AdminView 
            clients={clients} 
            onOpenDocuments={(c: Client) => { setSelectedClient(c); setIsDocumentModalOpen(true); }}
            onOpenEdit={(c: Client | null) => { setSelectedClient(c); setIsClientModalOpen(true); }}
            onDelete={(c: Client) => triggerConfirm(
              "Delete Client", 
              `Are you sure you want to delete ${c.company_name}?`, 
              () => handleDeleteClient(c.id)
            )}
          />
        ) : (
          <ClientView 
            clientId={user.client_id} 
            clientName={user.username}
            onDelete={(doc: any, refreshList: () => void) => triggerConfirm(
              "Delete Document", 
              `Delete ${doc.original_name}?`, 
              () => handleDeleteDocument(doc.id, refreshList)
            )}
          />
        )}
      </div>
      
      {/* Edit client modal */}
      <ClientModal 
        isOpen={isClientModalOpen}
        initialData={selectedClient}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
      />

      {/* Documents modal */}
      <DocumentModal 
        isOpen={isDocumentModalOpen}
        clientId={selectedClient?.id!}
        clientName={selectedClient?.company_name!}
        onClose={() => setIsDocumentModalOpen(false)}
      />

      {/* Delete confirmation modal */}
      <NotificationModal 
        {...modalConfig} 
        onClose={() => setModalConfig({...modalConfig, isOpen: false})} 
      />
    </main>
  );
}