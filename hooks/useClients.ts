import useLocalStorage from './useLocalStorage';

export interface Client {
    id: number;
    initials: string;
    name: string;
    cpf: string;
    lot: string;
    parcel: string;
    date: string;
    val: string;
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

const CLIENTS_STORAGE_KEY = 'finpay_clients';

function useClients() {
    const [clients, setClients] = useLocalStorage<Client[]>(CLIENTS_STORAGE_KEY, []);

    const addClient = (client: Client) => {
        setClients((prev) => [client, ...prev]);
    };

    const updateClient = (updatedClient: Client) => {
        setClients((prev) =>
            prev.map((client) => (client.id === updatedClient.id ? updatedClient : client))
        );
    };

    const deleteClient = (clientId: number) => {
        setClients((prev) => prev.filter((client) => client.id !== clientId));
    };

    const getClientById = (clientId: number): Client | undefined => {
        return clients.find((client) => client.id === clientId);
    };

    // Computed values
    const totalReceived = clients
        .filter((c) => c.status === 'Pago')
        .reduce((acc, curr) => acc + curr.numericVal, 0);

    const totalPending = clients
        .filter((c) => c.status === 'A Vencer')
        .reduce((acc, curr) => acc + curr.numericVal, 0);

    const totalLate = clients
        .filter((c) => c.status === 'Atrasado')
        .reduce((acc, curr) => acc + curr.numericVal, 0);

    const receivables = clients.filter((c) => c.status !== 'Pago');

    return {
        clients,
        setClients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        totalReceived,
        totalPending,
        totalLate,
        receivables,
    };
}

export default useClients;
