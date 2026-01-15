import { useState } from 'react';

export default function AdminView({ clients, onOpenDocuments, onOpenEdit, onDelete }: any) {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-end items-center mb-8">
            <button 
                onClick={() => { onOpenEdit(null); }}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-indigo-700 transition cursor-pointer"
            >
                + New Client
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
                <th className="p-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Company</th>
                <th className="p-4 text-sm font-bold text-slate-700 uppercase tracking-wider">VAT Number</th>
                <th className="p-4 text-sm font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-900">{client.company_name}</td>
                <td className="p-4 text-sm text-slate-500">{client.vat_number}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                        onClick={() => onOpenDocuments(client)} 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold cursor-pointer p-2">
                        Documents
                    </button>
                    <button 
                        onClick={() => onOpenEdit(client)} 
                        className="text-slate-600 hover:text-slate-800 text-sm font-semibold cursor-pointer p-2">
                        Edit
                    </button>
                    <button 
                        onClick={() => onDelete(client)} 
                        className="text-rose-600 hover:text-rose-800 text-sm font-semibold cursor-pointer p-2">
                        Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
}