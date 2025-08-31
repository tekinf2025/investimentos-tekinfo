import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProventoData {
  id: number;
  tipo_provento: string;
  ativo: string;
  data: string;
  valor: number;
  quantidade: number;
  a_receber: boolean;
  observacoes?: string;
  user_id?: string;
}

export const useProventos = () => {
  const [proventos, setProventos] = useState<ProventoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProventos = async () => {
    try {
      const { data, error } = await supabase
        .from('investimento_proventos')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setProventos(data || []);
    } catch (error) {
      console.error('Erro ao buscar proventos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os proventos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProvento = async (proventoData: Omit<ProventoData, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_proventos')
        .insert([proventoData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Provento adicionado com sucesso.",
      });
      
      fetchProventos();
    } catch (error) {
      console.error('Erro ao adicionar provento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o provento.",
        variant: "destructive",
      });
    }
  };

  const updateProvento = async (id: number, proventoData: Omit<Partial<ProventoData>, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_proventos')
        .update(proventoData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Provento atualizado com sucesso.",
      });
      
      fetchProventos();
    } catch (error) {
      console.error('Erro ao atualizar provento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o provento.",
        variant: "destructive",
      });
    }
  };

  const deleteProvento = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investimento_proventos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Provento excluído com sucesso.",
        variant: "destructive",
      });
      
      fetchProventos();
    } catch (error) {
      console.error('Erro ao excluir provento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o provento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProventos();
  }, []);

  return {
    proventos,
    isLoading,
    addProvento,
    updateProvento,
    deleteProvento,
    refetch: fetchProventos
  };
};