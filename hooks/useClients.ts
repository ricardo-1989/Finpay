
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
        if (!session?.user) {
            alert('ERRO: Você precisa estar logado para migrar seus dados! Faça login e tente novamente.');
            return;
        }

        const savedData = localStorage.getItem('finpay_clients');
        if (!savedData) {
            alert('ATENÇÃO: Nenhum dado antigo foi encontrado NESTE navegador/endereço.\n\nSe você usava o sistema em outro lugar (ex: localhost ou outro link), acesse o endereço antigo, vá em "Segurança", EXPORTE o backup e import aqui.');
            return;
        }

        const localClients = JSON.parse(savedData);
        if (!confirm(`ENCONTRADOS: ${localClients.length} clientes na memória deste navegador.\n\nDeseja enviar eles para o banco de dados agora?`)) return;

        let successCount = 0;
        let failCount = 0;

        setIsLoading(true);

        for (const c of localClients) {
            try {
                // Tenta corrigir formatos antigos
                let finalNumericVal = c.numericVal;
                if (!finalNumericVal && c.val) {
                    // Tenta extrair de "R$ 1.200,00"
                    const cleanVal = c.val.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
                    finalNumericVal = parseFloat(cleanVal) || 0;
                }

                let finalDueDate = c.date; // Esperado DD/MM/YYYY
                // Se já estiver em YYYY-MM-DD (ISO), o formatDateToISO vai falhar (retornar null), então precisamos tratar
                if (c.date && c.date.includes('-')) {
                    // Assume que já é ISO, converte para DD/MM/YYYY só pra passar no helper ou ajusta lógica
                    // Melhor: criar um helper interno aqui ou ajustar o addClient. 
                    // Vamos garantir que passa no formato DD/MM/YYYY para o addClient
                    const [y, m, d] = c.date.split('-');
                    if (y.length === 4) finalDueDate = `${d}/${m}/${y}`;
                }

                await addClient({
                    ...c,
                    id: undefined, // Garante gerar novo ID
                    numericVal: finalNumericVal,
                    date: finalDueDate,
                    // Garante campos mínimos
                    name: c.name || 'Cliente Sem Nome',
                    status: c.status || 'A Vencer'
                });
                successCount++;
            } catch (e: any) {
                console.error('Falha ao migrar cliente:', c.name, e);
                failCount++;
            }
        }

        setIsLoading(false);
        alert(`FIM DA MIGRAÇÃO:\n\n✅ Sucesso: ${successCount}\n❌ Falhas: ${failCount}\n\nSeus dados devem aparecer na lista agora!`);
        window.location.reload(); // Recarrega para garantir atualização visual
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
