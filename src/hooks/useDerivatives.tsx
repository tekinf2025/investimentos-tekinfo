import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DerivativeData {
  id: number;
  data: string;
  tipo_operacao: string;
  tipo_derivativo: string;
  ativo_subjacente: string;
  codigo_opcao: string;
  strike: number;
  vencimento: string;
  quantidade: number;
  premio: number;
  status: string;
  valor_total: number;
  observacoes?: string;
  user_id?: string;
}

export const useDerivatives = () => {
  const [derivatives, setDerivatives] = useState<DerivativeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDerivatives = async () => {
    try {
      const { data, error } = await supabase
        .from('investimento_derivativos')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setDerivatives(data || []);
    } catch (error) {
      console.error('Erro ao buscar derivativos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os derivativos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addDerivative = async (derivativeData: Omit<DerivativeData, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_derivativos')
        .insert([derivativeData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Derivativo adicionado com sucesso.",
      });
      
      fetchDerivatives();
    } catch (error) {
      console.error('Erro ao adicionar derivativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o derivativo.",
        variant: "destructive",
      });
    }
  };

  const updateDerivative = async (id: number, derivativeData: Omit<Partial<DerivativeData>, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_derivativos')
        .update(derivativeData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Derivativo atualizado com sucesso.",
      });
      
      fetchDerivatives();
    } catch (error) {
      console.error('Erro ao atualizar derivativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o derivativo.",
        variant: "destructive",
      });
    }
  };

  const deleteDerivative = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investimento_derivativos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Derivativo excluído com sucesso.",
        variant: "destructive",
      });
      
      fetchDerivatives();
    } catch (error) {
      console.error('Erro ao excluir derivativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o derivativo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDerivatives();
  }, []);

  return {
    derivatives,
    isLoading,
    addDerivative,
    updateDerivative,
    deleteDerivative,
    refetch: fetchDerivatives
  };
};