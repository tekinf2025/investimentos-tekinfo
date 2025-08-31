import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface VendaData {
  id: number;
  tipo_ativo: string;
  ativo: string;
  data: string;
  quantidade: number;
  preco: number;
  corretagem: number;
  valor_total: number;
  observacoes?: string;
  user_id?: string;
}

export const useVendas = () => {
  const [vendas, setVendas] = useState<VendaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchVendas = async () => {
    try {
      const { data, error } = await supabase
        .from('investimento_vendas')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setVendas(data || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addVenda = async (vendaData: Omit<VendaData, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_vendas')
        .insert([vendaData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Venda adicionada com sucesso.",
      });
      
      fetchVendas();
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a venda.",
        variant: "destructive",
      });
    }
  };

  const updateVenda = async (id: number, vendaData: Omit<Partial<VendaData>, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_vendas')
        .update(vendaData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso.",
      });
      
      fetchVendas();
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a venda.",
        variant: "destructive",
      });
    }
  };

  const deleteVenda = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investimento_vendas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Venda excluída com sucesso.",
        variant: "destructive",
      });
      
      fetchVendas();
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a venda.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  return {
    vendas,
    isLoading,
    addVenda,
    updateVenda,
    deleteVenda,
    refetch: fetchVendas
  };
};