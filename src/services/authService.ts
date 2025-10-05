import type { User } from '@/types';

// Serviço de autenticação - simula verificação de credenciais
// Função que simula a verificação de credenciais de um usuário
export const verifyUserCredentials = async (email: string, password: string): Promise<User | null> => {
  console.log(`Verificando credenciais para: ${email}`);
  
  // Em produção, aqui seria feita consulta ao banco de dados
  // Para demonstração, usa usuários fixos
  if (email === 'investidor@nextpeer.com' && password === '123') {
    return { id: 'user_01', name: 'Lucas Investidor', email, profileType: 'INVESTOR', personType: 'FISICA' };
  }
  if (email === 'tomador@nextpeer.com' && password === '123') {
    return { id: 'user_02', name: 'Ana Tomadora', email, profileType: 'BORROWER', personType: 'FISICA' };
  }

  return null;
};

// Serviço de autenticação - simula criação de usuário
// Função que simula a criação de um novo usuário
export const createNewUser = async (data: any): Promise<User> => {
    console.log("Criando novo usuário com os dados:", data);
    // Em produção, salvaria no banco de dados
    // Retorna usuário mockado para demonstração
    return {
        id: `user_${Math.floor(Math.random() * 1000)}`,
        name: "Novo Usuário",
        email: data.email,
        profileType: data.profileType,
        personType: data.personType || 'FISICA',
    }
}
