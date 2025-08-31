import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AtivoData {
  id: number;
  tipo_ativo: string;
  ativo: string;
  data: string;
  preco: number;
  user_id?: string;
  created_at?: string;
}

export const useAtivos = () => {
  const [ativos, setAtivos] = useState<AtivoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAtivos = async () => {
    try {
      const { data, error } = await supabase
        .from('investimento_ativo')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setAtivos(data || []);
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os ativos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAtivo = async (ativoData: Omit<AtivoData, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_ativo')
        .insert([ativoData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ativo adicionado com sucesso.",
      });
      
      fetchAtivos();
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o ativo.",
        variant: "destructive",
      });
    }
  };

  const updateAtivo = async (id: number, ativoData: Omit<Partial<AtivoData>, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_ativo')
        .update(ativoData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ativo atualizado com sucesso.",
      });
      
      fetchAtivos();
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o ativo.",
        variant: "destructive",
      });
    }
  };

  const deleteAtivo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investimento_ativo')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ativo excluído com sucesso.",
        variant: "destructive",
      });
      
      fetchAtivos();
    } catch (error) {
      console.error('Erro ao excluir ativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o ativo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAtivos();
  }, []);

  return {
    ativos,
    isLoading,
    addAtivo,
    updateAtivo,
    deleteAtivo,
    refetch: fetchAtivos
  };
};