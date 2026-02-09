# Product Requirements Document (PRD) - FinPay

## 1. Visão Geral do Produto
**FinPay** é uma aplicação web de gestão financeira e administrativa desenvolvida para **Ricardo Empreendimentos**. O sistema visa centralizar o controle de clientes, empreendimentos, contas a receber e comunicação, oferecendo uma visão clara da saúde financeira e operacional do negócio.

## 2. Objetivos
*   **Centralização de Dados**: Unificar informações de clientes e pagamentos.
*   **Automação**: Facilitar o cálculo de atrasos e status de clientes.
*   **Comunicação**: Agilizar o envio de mensagens (WhatsApp) para cobranças e avisos.
*   **Segurança**: Proteção de dados através de autenticação robusta (Supabase).
*   **Visualização**: Dashboards e relatórios para tomada de decisão.

## 3. Stack Tecnológica
*   **Frontend**: React (v19) com TypeScript
*   **Build Tool**: Vite
*   **Estilização**: CSS Modules / Tailwind (Inferido)
*   **Backend / BaaS**: Supabase (Auth, Database)
*   **IA**: Google GenAI SDK (Integração Gemini)
*   **Visualização de Dados**: Recharts
*   **Geração de Documentos**: jsPDF
*   **Hospedagem**: Vercel (Configurado via `vercel.json`)

## 4. Funcionalidades Principais

### 4.1. Autenticação e Segurança
*   **Login (`Login.tsx`)**: Acesso restrito via credenciais.
*   **Integração Supabase**: Gerenciamento de sessões e usuários.
*   **Configurações de Segurança (`SecuritySettings.tsx`)**: Controles de acesso e proteção.

### 4.2. Gestão de Clientes
*   **Cadastro (`NewClientForm.tsx`)**: Inserção detalhada de novos clientes.
*   **Portal do Cliente (`ClientPortal.tsx`)**: Visualização de dados específicos do cliente.
*   **Smart Queue (`SmartQueue.tsx`)**: Fila inteligente para atendimento ou processamento de clientes.

### 4.3. Gestão Financeira
*   **Dashboard (`Dashboard.tsx`)**: Visão geral de métricas, gráficos de receita e status.
*   **Lista Financeira (`FinanceList.tsx`)**: Tabela principal de controle de pagamentos.
    *   *Regra de Negócio*: Clientes com pagamentos vencidos têm status alterado automaticamente para "Atrasado".
*   **Contas a Receber (`Receivables.tsx`)**: Monitoramento de entradas futuras.
*   **Relatórios (`FinancialReports.tsx`)**: Geração de PDFs e visualização de balanços.
*   **Comparativos (`Comparison.tsx`)**: Análise de desempenho entre períodos ou empreendimentos.

### 4.4. Operacional e Empreendimentos
*   **Empreendimentos (`Developments.tsx`)**: Gestão de lotes/imóveis.
*   **Kanban (`KanbanBoard.tsx`)**: Gestão visual de tarefas ou status de processos.
*   **Comunicação (`WhatsAppSender.tsx`)**: Envio de mensagens padronizadas.
    *   *Padrão*: Assinatura "Att, Ricardo Empreendimentos".

## 5. Estrutura de Diretórios Atual
*   `/components`: Componentes UI e lógica de negócios (FinanceList, Login, etc.).
*   `/hooks`: Lógica reutilizável (React Hooks).
*   `/utils`: Funções auxiliares.
*   `/pages`: Páginas de roteamento (se houver roteador configurado).

## 6. Integrações Externas
*   **Supabase Client**: Conexão persistente para dados em tempo real e auth.
*   **Google Gemini**: Potencial uso para análise inteligente de dados ou assistente virtual.

## 7. Roadmap e Melhorias Futuras
*   **Expansão de Relatórios**: Mais filtros e exportações personalizadas.
*   **Mobile Mobile**: Otimização da responsividade para uso em campo.
*   **IA Avançada**: Utilizar o SDK do Gemini para insights preditivos sobre inadimplência.
