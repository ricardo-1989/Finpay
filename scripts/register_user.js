
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptgbygvabrjstiafshtj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2J5Z3ZhYnJqc3RpYWZzaHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjM5MDcsImV4cCI6MjA4MjU5OTkwN30.NPjAOqAX4Ry9Du3Qo1q3moLKEpuSWpmyi8croFgiuAc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerUser() {
    console.log("Tentando criar usuário...");

    const { data, error } = await supabase.auth.signUp({
        email: 'ricardoempreendimentos2025@gmail.com',
        password: '@Ricardo-2026',
        options: {
            data: {
                role: 'admin',
            }
        }
    });

    if (error) {
        console.error("Erro ao criar usuário:", error.message);
    } else {
        console.log("Usuário criado com sucesso:", data.user?.email);
        console.log("ATENÇÃO: Se o Supabase exigir confirmação de email, verifique sua caixa de entrada.");
    }
}

registerUser();
