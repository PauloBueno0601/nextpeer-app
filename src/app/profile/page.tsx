"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types"; // Importamos a nossa nova definição de User

export default function ProfilePage() {
  // Estado para armazenar os dados do usuário e o estado de carregamento
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulação de busca de dados de uma API
  useEffect(() => {
    // Em um aplicativo real, aqui você faria uma chamada `fetch` para a sua API.
    // Por enquanto, vamos usar dados de exemplo (mock data).
    const mockUserData: User = {
      id: "123",
      name: "Ana Silva",
      email: "ana.silva@email.com",
      profileType: "BORROWER", // Mude para "INVESTOR" para ver a outra visão
    };

    // Simula um tempo de espera da rede
    setTimeout(() => {
      setCurrentUser(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="p-8">Carregando perfil...</div>;
  }

  if (!currentUser) {
    return <div className="p-8">Usuário não encontrado.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{currentUser.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </CardHeader>
        <CardContent>
          {currentUser.profileType === "BORROWER" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">R$ 5.000</p>
                <p className="text-sm text-muted-foreground">Total Emprestado</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Empréstimos Ativos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">780</p>
                <p className="text-sm text-muted-foreground">Score de Crédito</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">Bom Histórico</Badge>
                <p className="text-sm text-muted-foreground mt-1">Histórico</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">R$ 15.000</p>
                <p className="text-sm text-muted-foreground">Total Investido</p>
              </div>
               <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Investimentos Ativos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">R$ 1.200</p>
                <p className="text-sm text-muted-foreground">Retornos</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

