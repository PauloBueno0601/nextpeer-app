import { NextResponse } from 'next/server';
import { verifyUserCredentials } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Controller chama o Model (authService)
    const user = await verifyUserCredentials(email, password);

    if (!user) {
      // 2. Controller retorna erro para a View
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // 3. Controller retorna sucesso para a View
    // (No mundo real, você criaria um token JWT e o retornaria aqui)
    return NextResponse.json({ message: 'Login bem-sucedido!', user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
