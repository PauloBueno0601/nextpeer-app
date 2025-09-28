import type { User } from '@/types';

// Função que simula a verificação de credenciais de um usuário
export const verifyUserCredentials = async (email: string, password: string): Promise<User | null> => {
  console.log(`Verificando credenciais para: ${email}`);
  
  // No mundo real, aqui você consultaria seu banco de dados e verificaria a senha.
  // Para o hackathon, vamos simular com usuários fixos.
  if (email === 'investidor@nextpeer.com' && password === '123') {
    return { id: 'user_01', name: 'Lucas Investidor', email, profileType: 'INVESTOR' };
  }
  if (email === 'tomador@nextpeer.com' && password === '123') {
    return { id: 'user_02', name: 'Ana Tomadora', email, profileType: 'BORROWER' };
  }

  return null;
};

// Função que simula a criação de um novo usuário
export const createNewUser = async (data: any): Promise<User> => {
    console.log("Criando novo usuário com os dados:", data);
    // Lógica para salvar o novo usuário no banco de dados.
    // Retornamos um usuário mockado para o exemplo.
    return {
        id: `user_${Math.floor(Math.random() * 1000)}`,
        name: "Novo Usuário",
        email: data.email,
        profileType: data.profileType,
    }
}
