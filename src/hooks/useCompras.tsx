import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CompraData {
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

export const useCompras = () => {
  const [compras, setCompras] = useState<CompraData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompras = async () => {
    try {
      const { data, error } = await supabase
        .from('investimento_compras')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setCompras(data || []);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as compras.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCompra = async (compraData: Omit<CompraData, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_compras')
        .insert([compraData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Compra adicionada com sucesso.",
      });
      
      fetchCompras();
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a compra.",
        variant: "destructive",
      });
    }
  };

  const updateCompra = async (id: number, compraData: Omit<Partial<CompraData>, 'id'>) => {
    try {
      const { error } = await supabase
        .from('investimento_compras')
        .update(compraData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Compra atualizada com sucesso.",
      });
      
      fetchCompras();
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a compra.",
        variant: "destructive",
      });
    }
  };

  const deleteCompra = async (id: number) => {
    try {
      const { error } = await supabase
        .from('investimento_compras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Compra excluída com sucesso.",
        variant: "destructive",
      });
      
      fetchCompras();
    } catch (error) {
      console.error('Erro ao excluir compra:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a compra.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return {
    compras,
    isLoading,
    addCompra,
    updateCompra,
    deleteCompra,
    refetch: fetchCompras
  };
};