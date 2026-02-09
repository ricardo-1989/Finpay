
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../components/auth/AuthProvider';

export interface Client {
    id: number;
    initials: string;
    name: string;
    cpf: string;
    lot: string;
    parcel: string;
    date: string; // Display date DD/MM/YYYY
    val: string; // Display Value R$ 0,00
    numericVal: number;
    status: string;
    color: string;
    photo?: string | null;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    developmentName?: string;
    originalDueDate?: string;
}

// Helper to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDateToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

// Helper to format date from DD/MM/YYYY to YYYY-MM-DD
const formatDateToISO = (displayDate: string): string | null => {
    if (!displayDate) return null;
    const parts = displayDate.split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

function useClients() {
    const { session } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        if (!session?.user) {
            setClients([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedClients: Client[] = (data || []).map(row => ({
                id: row.id,
                name: row.name,
                cpf: row.cpf || '',
                lot: row.lot || '',
                parcel: row.parcel || '',
                date: row.due_date ? formatDateToDisplay(row.due_date) : '',
                val: `R$ ${(row.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                numericVal: Number(row.value) || 0,
                status: row.status || 'A Vencer',
                color: row.status === 'Pago' ? 'teal' : row.status === 'Atrasado' ? 'red' : 'orange',
                photo: row.photo_url || null, // Map photo_url to photo
                initials: row.initials || row.name.substring(0, 2).toUpperCase(),
                phone: row.phone,
                email: row.email,
                address: row.address,
                notes: row.notes
            }));

            setClients(mappedClients);
        } catch (err: any) {
            console.error('Error fetching clients:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const addClient = async (client: Omit<Client, 'id'>) => {
        if (!session?.user) return;

        try {
            const dueDateISO = formatDateToISO(client.date);
            const { data, error } = await supabase
                .from('clients')
                .insert([
                    {
                        user_id: session.user.id,
                        name: client.name,
                        cpf: client.cpf,
                        lot: client.lot,
                        parcel: client.parcel,
                        due_date: dueDateISO,
                        value: client.numericVal,
                        status: client.status,
                        phone: client.phone,
                        email: client.email,
                        address: client.address,
                        notes: client.notes,
                        photo_url: client.photo, // Note: Direct base64 is heavy, ideally upload to Storage first
                        initials: client.initials
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            await fetchClients(); // Refresh list
            return data;
        } catch (err: any) {
            console.error('Error adding client:', err);
            throw err;
        }
    };

    const updateClient = async (updatedClient: Client) => {
        if (!session?.user) return;

        try {
            const dueDateISO = formatDateToISO(updatedClient.date);
            const { error } = await supabase
                .from('clients')
                .update({
                    name: updatedClient.name,
                    cpf: updatedClient.cpf,
                    lot: updatedClient.lot,
                    parcel: updatedClient.parcel,
                    due_date: dueDateISO,
                    value: updatedClient.numericVal,
                    status: updatedClient.status,
                    phone: updatedClient.phone,
                    email: updatedClient.email,
                    address: updatedClient.address,
                    notes: updatedClient.notes,
                    photo_url: updatedClient.photo
                })
                .eq('id', updatedClient.id);

            if (error) throw error;

            // Optimistic update
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        } catch (err: any) {
            console.error('Error updating client:', err);
            alert('Erro ao atualizar. Verifique sua conexão.');
        }
    };

    const deleteClient = async (clientId: number) => {
        if (!session?.user) return;

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', clientId);

            if (error) throw error;

            setClients(prev => prev.filter(c => c.id !== clientId));
        } catch (err: any) {
            console.error('Error deleting client:', err);
            alert('Erro ao excluir.');
        }
    };

    const getClientById = (clientId: number): Client | undefined => {
        return clients.find((client) => client.id === clientId);
    };

    // Migration Utility
    const migrateLocalStorage = async () => {
        const savedData = localStorage.getItem('finpay_clients');
        if (!savedData) {
            alert('Nenhum dado local encontrado para migrar.');
            return;
        }

        const localClients = JSON.parse(savedData);
        if (!confirm(`Encontrados ${localClients.length} clientes locais. Deseja fazer upload para o Supabase?`)) return;

        let successCount = 0;
        for (const c of localClients) {
            try {
                // Remove ID to let DB generate a new one, fix date format
                await addClient({
                    ...c,
                    id: undefined // Ensure we don't send the old ID
                });
                successCount++;
            } catch (e) {
                console.error('Falha ao migrar cliente:', c.name, e);
            }
        }
        alert(`Migração concluída! ${successCount}/${localClients.length} importados.`);
        fetchClients();
    };

    return {
        clients,
        isLoading,
        error,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        refresh: fetchClients,
        migrateLocalStorage,
        // Computed metrics
        totalReceived: clients.filter(c => c.status === 'Pago').reduce((a, b) => a + b.numericVal, 0),
        totalPending: clients.filter(c => c.status === 'A Vencer').reduce((a, b) => a + b.numericVal, 0),
        totalLate: clients.filter(c => c.status === 'Atrasado').reduce((a, b) => a + b.numericVal, 0),
        receivables: clients.filter(c => c.status !== 'Pago')
    };
}

export default useClients;
