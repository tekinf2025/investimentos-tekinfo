import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useAtivos } from "@/hooks/useAtivos";

// Tipos das transações das outras páginas
interface Transaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  quantidade: number;
  preco: number;
  corretagem: number;
  valor_total: number;
}

interface AssetTransaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  preco: number;
}

interface SaleTransaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  quantidade: number;
  preco: number;
  corretagem: number;
  valor_total: number;
}

interface DividendTransaction {
  id: string;
  tipo_provento: string;
  ativo: string;
  data: string;
  valor: number;
  quantidade: number;
  a_receber: boolean;
}

interface DerivativeTransaction {
  id: string;
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
}

const Dashboard = () => {
  // Hook para puxar dados dos ativos do Supabase
  const { ativos } = useAtivos();

  // Dados das transações (mesmos dados das outras páginas)
  const purchases: Transaction[] = [
    {
      id: "1",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "GARE11",
      data: "2025-08-28",
      quantidade: 400,
      preco: 9.04,
      corretagem: 0,
      valor_total: 3616
    },
    {
      id: "2",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "MXRF11",
      data: "2025-08-27",
      quantidade: 4750,
      preco: 9.58,
      corretagem: 0,
      valor_total: 45505
    },
    {
      id: "3",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "MXRF11",
      data: "2025-08-26",
      quantidade: 250,
      preco: 9.58,
      corretagem: 0,
      valor_total: 2395
    },
    {
      id: "4",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2025-08-22",
      quantidade: 200,
      preco: 19.75,
      corretagem: 0,
      valor_total: 3950
    },
    {
      id: "5",
      tipo_ativo: "acoes",
      ativo: "GOAU4",
      data: "2024-01-01",
      quantidade: 3300,
      preco: 9.73,
      corretagem: 0,
      valor_total: 32109
    },
    {
      id: "6",
      tipo_ativo: "acoes",
      ativo: "PETR4",
      data: "2025-07-07",
      quantidade: 400,
      preco: 34.34,
      corretagem: 0,
      valor_total: 13736
    },
    {
      id: "7",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2024-06-01",
      quantidade: 700,
      preco: 24.86,
      corretagem: 0,
      valor_total: 17402
    },
    {
      id: "8",
      tipo_ativo: "renda_fixa",
      ativo: "Tesouro Selic 2029",
      data: "2022-10-05",
      quantidade: 3,
      preco: 13590,
      corretagem: 0,
      valor_total: 40770
    },
    {
      id: "9",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2025-07-23",
      quantidade: 300,
      preco: 20.25,
      corretagem: 0,
      valor_total: 6075
    }
  ];

  const sales: SaleTransaction[] = [
    {
      id: "1",
      tipo_ativo: "renda_fixa",
      ativo: "Tesouro Selic 2029",
      data: "2025-08-26",
      quantidade: 3,
      preco: 16518.04,
      corretagem: 0,
      valor_total: 49554.12
    },
    {
      id: "2",
      tipo_ativo: "acoes",
      ativo: "GOAU4",
      data: "2025-07-17",
      quantidade: 800,
      preco: 9.21,
      corretagem: 0,
      valor_total: 7368
    }
  ];

  const dividends: DividendTransaction[] = [
    {
      id: "1",
      tipo_provento: "dividendos",
      ativo: "GARE11",
      data: "2025-09-07",
      valor: 0.08,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "2",
      tipo_provento: "dividendos",
      ativo: "MXRF11",
      data: "2025-09-14",
      valor: 0.1,
      quantidade: 5000,
      a_receber: false
    },
    {
      id: "3",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-11-22",
      valor: 0.28,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "4",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-12-22",
      valor: 0.31,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "5",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-08-19",
      valor: 0.08,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "6",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2024-12-05",
      valor: 0.41,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "7",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2024-12-26",
      valor: 0.15,
      quantidade: 900,
      a_receber: false
    },
    {
      id: "8",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-03-19",
      valor: 0.44,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "9",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-03-20",
      valor: 0.13,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "10",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-05-25",
      valor: 0.19,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "11",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-08-20",
      valor: 0.08,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "12",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-06-19",
      valor: 0.36,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "13",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-03-16",
      valor: 0.05,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "14",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-05-19",
      valor: 0.08,
      quantidade: 3300,
      a_receber: false
    },
    {
      id: "15",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-09-22",
      valor: 0.43,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "16",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-06-12",
      valor: 0.18,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "17",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-08-20",
      valor: 0.38,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "18",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-12-16",
      valor: 0.13,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "19",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-05-19",
      valor: 0.36,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "20",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2024-12-22",
      valor: 1.55,
      quantidade: 200,
      a_receber: false
    },
    {
      id: "21",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-02-19",
      valor: 0.56,
      quantidade: 200,
      a_receber: false
    },
    {
      id: "22",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-03-19",
      valor: 0.67,
      quantidade: 200,
      a_receber: false
    }
  ];

  const derivatives: DerivativeTransaction[] = [
    {
      id: "1",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASL204",
      strike: 20.44,
      vencimento: "2025-12-19",
      quantidade: 200,
      premio: 1.5,
      status: "aberta",
      valor_total: 300
    },
    {
      id: "2",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASH290",
      strike: 27.36,
      vencimento: "2026-08-21",
      quantidade: 400,
      premio: 4.9,
      status: "aberta",
      valor_total: 1960
    },
    {
      id: "3",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASJ270",
      strike: 25.61,
      vencimento: "2026-10-16",
      quantidade: 200,
      premio: 5.5,
      status: "aberta",
      valor_total: 1100
    },
    {
      id: "4",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASJ210",
      strike: 19.61,
      vencimento: "2026-10-16",
      quantidade: 400,
      premio: 4.12,
      status: "aberta",
      valor_total: 1648
    },
    {
      id: "5",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "PETR4",
      codigo_opcao: "PETRJ362",
      strike: 31.27,
      vencimento: "2026-10-16",
      quantidade: 200,
      premio: 6.1,
      status: "aberta",
      valor_total: 1220
    },
    {
      id: "6",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "PETR4",
      codigo_opcao: "PETRD400",
      strike: 30.25,
      vencimento: "2026-04-17",
      quantidade: 200,
      premio: 7.9,
      status: "aberta",
      valor_total: 1580
    },
    {
      id: "7",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "GOAU4",
      codigo_opcao: "GOAUL100",
      strike: 9.39,
      vencimento: "2025-12-18",
      quantidade: 1500,
      premio: 2.08,
      status: "aberta",
      valor_total: 3120
    },
    {
      id: "8",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "GOAU4",
      codigo_opcao: "GOAUJ974",
      strike: 9.4,
      vencimento: "2026-10-15",
      quantidade: 1000,
      premio: 2.6,
      status: "aberta",
      valor_total: 2600
    }
  ];

  // Função auxiliar para obter preço real do ativo
  const getAssetRealPrice = (assetName: string): number => {
    const asset = ativos.find(a => a.ativo === assetName);
    return asset ? asset.preco : 0;
  };

  // Função auxiliar para calcular total de derivativos por ativo
  const getDerivativesTotalByAsset = (assetName: string): number => {
    return derivatives
      .filter(derivative => derivative.ativo_subjacente === assetName)
      .reduce((total, derivative) => total + derivative.valor_total, 0);
  };

  // Calcular operações encerradas
  const closedOperations = useMemo(() => {
    const assetMap = new Map();
    
    // Processar compras
    purchases.forEach(purchase => {
      if (!assetMap.has(purchase.ativo)) {
        assetMap.set(purchase.ativo, {
          ativo: purchase.ativo,
          tipo_ativo: purchase.tipo_ativo,
          compras: [],
          vendas: []
        });
      }
      assetMap.get(purchase.ativo).compras.push(purchase);
    });

    // Processar vendas
    sales.forEach(sale => {
      if (assetMap.has(sale.ativo)) {
        assetMap.get(sale.ativo).vendas.push(sale);
      }
    });

    // Identificar operações encerradas e calcular ganho/perda
    const closedOps = [];
    assetMap.forEach(asset => {
      const totalComprado = asset.compras.reduce((acc, compra) => acc + compra.quantidade, 0);
      const totalVendido = asset.vendas.reduce((acc, venda) => acc + venda.quantidade, 0);
      
      // Se quantidade vendida >= quantidade comprada, a operação está encerrada
      if (totalVendido >= totalComprado && totalComprado > 0) {
        const valorCompra = asset.compras.reduce((acc, compra) => acc + compra.valor_total, 0);
        const valorVenda = asset.vendas.reduce((acc, venda) => acc + venda.valor_total, 0);
        const ganhoPerda = valorVenda - valorCompra;
        
        closedOps.push({
          ativo: asset.ativo,
          tipo_ativo: asset.tipo_ativo,
          quantidade: totalComprado,
          valor_compra: valorCompra,
          valor_venda: valorVenda,
          ganho_perda: ganhoPerda,
          percentual_ganho: valorCompra > 0 ? (ganhoPerda / valorCompra) * 100 : 0
        });
      }
    });

    return closedOps.sort((a, b) => b.ganho_perda - a.ganho_perda);
  }, [purchases, sales]);

  // Cálculo consolidado por ativo
  const assetAnalysis = useMemo(() => {
    const assetMap = new Map();

    // Processar compras
    purchases.forEach(purchase => {
      if (!assetMap.has(purchase.ativo)) {
        assetMap.set(purchase.ativo, {
          ativo: purchase.ativo,
          tipo_ativo: purchase.tipo_ativo,
          quantidade_compras: 0,
          valor_compras: 0,
          quantidade_vendas: 0,
          valor_vendas: 0,
          valor_proventos: 0,
          valor_derivativos: 0,
        });
      }
      const asset = assetMap.get(purchase.ativo);
      asset.quantidade_compras += purchase.quantidade;
      asset.valor_compras += purchase.valor_total;
    });

    // Processar vendas
    sales.forEach(sale => {
      if (!assetMap.has(sale.ativo)) {
        assetMap.set(sale.ativo, {
          ativo: sale.ativo,
          tipo_ativo: sale.tipo_ativo,
          quantidade_compras: 0,
          valor_compras: 0,
          quantidade_vendas: 0,
          valor_vendas: 0,
          valor_proventos: 0,
          valor_derivativos: 0,
        });
      }
      const asset = assetMap.get(sale.ativo);
      asset.quantidade_vendas += sale.quantidade;
      asset.valor_vendas += sale.valor_total;
    });

    // Processar proventos
    dividends.forEach(dividend => {
      if (assetMap.has(dividend.ativo)) {
        const asset = assetMap.get(dividend.ativo);
        asset.valor_proventos += dividend.valor * dividend.quantidade;
      }
    });

    // Processar derivativos
    derivatives.forEach(derivative => {
      if (assetMap.has(derivative.ativo_subjacente)) {
        const asset = assetMap.get(derivative.ativo_subjacente);
        asset.valor_derivativos += derivative.valor_total;
      }
    });

    // Calcular posição líquida e preço médio
    return Array.from(assetMap.values()).map(asset => {
      const quantidade_liquida = asset.quantidade_compras - asset.quantidade_vendas;
      const valor_liquido = asset.valor_compras - asset.valor_vendas - asset.valor_proventos - asset.valor_derivativos;
      const preco_medio = quantidade_liquida > 0 ? valor_liquido / quantidade_liquida : 0;

      return {
        ...asset,
        quantidade_liquida,
        valor_liquido,
        preco_medio: Number(preco_medio.toFixed(2)),
        preco_real: getAssetRealPrice(asset.ativo),
        derivativos_total: getDerivativesTotalByAsset(asset.ativo),
        variacao_percentual: preco_medio > 0 ? ((getAssetRealPrice(asset.ativo) - preco_medio) / preco_medio) * 100 : 0,
      };
    }).filter(asset => asset.quantidade_liquida > 0);
  }, [ativos, derivatives]);

  // Tradução dos tipos de ativo
  const translateAssetType = (type: string) => {
    const translations = {
      'acoes': 'Ações',
      'fundos_imobiliarios': 'Fundos Imobiliários',
      'renda_fixa': 'Renda Fixa'
    };
    return translations[type] || type;
  };

  // Dados para o gráfico de pizza por ativo individual
  const assetPieData = useMemo(() => {
    return assetAnalysis
      .sort((a, b) => b.valor_liquido - a.valor_liquido)
      .map(asset => ({
        name: asset.ativo,
        value: asset.valor_liquido,
        tipo: translateAssetType(asset.tipo_ativo)
      }));
  }, [assetAnalysis]);

  // Cores para os gráficos - expandida para mais ativos
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
    '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e',
    '#e17055', '#81ecec', '#74b9ff', '#0984e3', '#00b894'
  ];

  // Dados para o gráfico de barras dos ativos individuais
  const topAssetsData = assetAnalysis
    .sort((a, b) => b.valor_liquido - a.valor_liquido)
    .slice(0, 10)
    .map(asset => ({
      ativo: asset.ativo,
      valor: asset.valor_liquido,
      quantidade: asset.quantidade_liquida,
      precoMedio: asset.preco_medio,
    }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Navigation />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard - Análise da Carteira
          </h1>
          <p className="text-text-secondary">
            Visão consolidada dos seus investimentos na B3
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(assetAnalysis.reduce((acc, asset) => acc + asset.valor_liquido, 0))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">
                {assetAnalysis.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proventos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-success">
                 {new Intl.NumberFormat('pt-BR', {
                   style: 'currency',
                   currency: 'BRL'
                 }).format(dividends.reduce((acc, div) => acc + (div.valor * div.quantidade), 0))}
               </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Derivativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(derivatives.reduce((acc, der) => acc + der.valor_total, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza - Distribuição por Ativo */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Ativo</CardTitle>
              <CardDescription>Valor investido por ativo individual</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 5 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value),
                      'Valor Investido'
                    ]}
                    labelFormatter={(name) => `${name}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Top Ativos */}
          <Card>
            <CardHeader>
              <CardTitle>Maiores Posições</CardTitle>
              <CardDescription>Top 10 ativos por valor investido</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topAssetsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ativo" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value),
                      'Valor Líquido'
                    ]}
                  />
                  <Bar dataKey="valor" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Novos Gráficos - Proventos e Derivativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Barras - Top Ativos por Proventos */}
          <Card>
            <CardHeader>
              <CardTitle>Maiores Posições</CardTitle>
              <CardDescription>Top 10 ativos por valor de proventos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetAnalysis
                  .filter(asset => asset.valor_proventos > 0)
                  .sort((a, b) => b.valor_proventos - a.valor_proventos)
                  .slice(0, 10)
                  .map(asset => ({
                    ativo: asset.ativo,
                    valor: asset.valor_proventos,
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ativo" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value),
                      'Valor Proventos'
                    ]}
                  />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Top Ativos por Derivativos */}
          <Card>
            <CardHeader>
              <CardTitle>Maiores Posições</CardTitle>
              <CardDescription>Top 10 ativos por valor de Derivativos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetAnalysis
                  .filter(asset => asset.valor_derivativos > 0)
                  .sort((a, b) => b.valor_derivativos - a.valor_derivativos)
                  .slice(0, 10)
                  .map(asset => ({
                    ativo: asset.ativo,
                    valor: asset.valor_derivativos,
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ativo" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value),
                      'Valor Derivativos'
                    ]}
                  />
                  <Bar dataKey="valor" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela detalhada */}
        <Card>
          <CardHeader>
            <CardTitle>Posições Detalhadas</CardTitle>
            <CardDescription>Análise completa por ativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium text-text-primary">Ativo</th>
                    <th className="text-left p-2 font-medium text-text-primary">Tipo</th>
                    <th className="text-right p-2 font-medium text-text-primary">Quantidade</th>
                    <th className="text-right p-2 font-medium text-text-primary">Preço Médio</th>
                    <th className="text-right p-2 font-medium text-text-primary">Valor Total</th>
                    <th className="text-right p-2 font-medium text-text-primary">Preço Real</th>
                    <th className="text-right p-2 font-medium text-text-primary">Variação %</th>
                    <th className="text-right p-2 font-medium text-text-primary">Proventos</th>
                    <th className="text-right p-2 font-medium text-text-primary">Derivativos</th>
                  </tr>
                </thead>
                <tbody>
                  {assetAnalysis.map((asset, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-2 font-medium text-text-primary">{asset.ativo}</td>
                      <td className="p-2 text-text-secondary">{translateAssetType(asset.tipo_ativo)}</td>
                      <td className="p-2 text-right text-text-secondary">
                        {new Intl.NumberFormat('pt-BR').format(asset.quantidade_liquida)}
                      </td>
                      <td className="p-2 text-right text-text-secondary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2
                        }).format(asset.preco_medio)}
                      </td>
                      <td className="p-2 text-right font-medium text-text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(asset.valor_liquido)}
                      </td>
                      <td className="p-2 text-right text-text-secondary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2
                        }).format(asset.preco_real)}
                      </td>
                      <td className={`p-2 text-right font-medium ${asset.variacao_percentual > 0 ? 'text-green-600' : asset.variacao_percentual < 0 ? 'text-red-600' : 'text-text-secondary'}`}>
                        {asset.variacao_percentual > 0 ? '+' : ''}{asset.variacao_percentual.toFixed(2)}%
                      </td>
                      <td className="p-2 text-right text-success">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(asset.valor_proventos)}
                      </td>
                      <td className="p-2 text-right text-success">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(asset.derivativos_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Operações Encerradas */}
        {closedOperations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Operações Encerradas</CardTitle>
              <CardDescription>Posições que foram completamente vendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-medium text-text-primary">Ativo</th>
                      <th className="text-left p-2 font-medium text-text-primary">Tipo</th>
                      <th className="text-right p-2 font-medium text-text-primary">Quantidade</th>
                      <th className="text-right p-2 font-medium text-text-primary">Valor Compra</th>
                      <th className="text-right p-2 font-medium text-text-primary">Valor Venda</th>
                      <th className="text-right p-2 font-medium text-text-primary">Ganho/Perda</th>
                      <th className="text-right p-2 font-medium text-text-primary">Variação %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedOperations.map((operation, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="p-2 font-medium text-text-primary">{operation.ativo}</td>
                        <td className="p-2 text-text-secondary">{translateAssetType(operation.tipo_ativo)}</td>
                        <td className="p-2 text-right text-text-secondary">
                          {new Intl.NumberFormat('pt-BR').format(operation.quantidade)}
                        </td>
                        <td className="p-2 text-right text-text-secondary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(operation.valor_compra)}
                        </td>
                        <td className="p-2 text-right text-text-secondary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(operation.valor_venda)}
                        </td>
                        <td className={`p-2 text-right font-medium ${operation.ganho_perda > 0 ? 'text-green-600' : operation.ganho_perda < 0 ? 'text-red-600' : 'text-text-secondary'}`}>
                          {operation.ganho_perda > 0 ? '+' : ''}{new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(operation.ganho_perda)}
                        </td>
                        <td className={`p-2 text-right font-medium ${operation.percentual_ganho > 0 ? 'text-green-600' : operation.percentual_ganho < 0 ? 'text-red-600' : 'text-text-secondary'}`}>
                          {operation.percentual_ganho > 0 ? '+' : ''}{operation.percentual_ganho.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;