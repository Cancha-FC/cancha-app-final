import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css'; // Estilos para a página

const HomePage = () => {
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    codigoCategoria: '', // ID do licenciado para cálculo da comissão
  });

  const [vendasPorDia, setVendasPorDia] = useState(null);
  const [vendasPorProduto, setVendasPorProduto] = useState(null);
  const [cardData, setCardData] = useState({
    pedidos: 0,
    volume: 0,
    venda: 0,
    comissao: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleFilter = async (filterData) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterData,
    }));

    await fetchData(filterData);
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    return null;
  };

  const fetchData = async (filterData) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filterData.startDate) params.append('pedido_data__gte', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('pedido_data__lte', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigoCategoria', filterData.codigoCategoria);

      const responseItens = await fetch(`http://127.0.0.1:8000/api/pedido-itens/?${params.toString()}`, {
        headers: { 'Authorization': 'Basic YWRtaW46MQ==' },
      });

      const dataItens = await responseItens.json();

      if (!Array.isArray(dataItens)) {
        throw new Error('Dados inválidos retornados da API');
      }

      processCardData(dataItens);
      processGraphData(dataItens);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const processCardData = (itens) => {
    const pedidosUnicos = new Set(itens.map((item) => item.idPedido)); // IDs únicos
    const totalVolume = itens.reduce((total, item) => total + parseFloat(item.quantidade || 0), 0);
    const totalVenda = itens.reduce((total, item) => total + parseFloat(item.valor || 0), 0);

    const totalComissao = itens.reduce((total, item) => {
      const comissaoPercentual = parseFloat(item.comissao || 0) / 100; // Taxa de comissão
      return total + (parseFloat(item.valor || 0) * comissaoPercentual); // Adiciona o valor da comissão
    }, 0);

    setCardData({
      pedidos: pedidosUnicos.size, // Quantidade de IDs únicos
      volume: totalVolume,
      venda: totalVenda,
      comissao: totalComissao,
    });
  };

  const processGraphData = (itens) => {
    // Processamento de Vendas por Dia
    const vendasPorDiaData = itens.reduce((acc, item) => {
      const dia = new Date(item.pedido_data).toLocaleDateString();
      acc[dia] = (acc[dia] || 0) + parseFloat(item.valor || 0);
      return acc;
    }, {});
  
    // Ordenar os dados de vendas por dia
    const vendasPorDiaOrdenadas = Object.entries(vendasPorDiaData)
      .sort(([dataA], [dataB]) => {
        const dataObjA = new Date(dataA.split("/").reverse().join("-")); // Converte para ISO
        const dataObjB = new Date(dataB.split("/").reverse().join("-")); // Converte para ISO
        return dataObjA - dataObjB;
      });
  
    setVendasPorDia({
      labels: vendasPorDiaOrdenadas.map(([data]) => data), // Datas ordenadas
      datasets: [
        {
          label: 'Vendas',
          backgroundColor: '#46ad5a',
          data: vendasPorDiaOrdenadas.map(([, valor]) => valor), // Valores ordenados
        },
      ],
    });
  
    // Processamento de Vendas por Produto
    const vendasPorProdutoData = itens.reduce((acc, item) => {
      const produtoId = item.produto_id; // Agrupar por produto_id
      acc[produtoId] = (acc[produtoId] || 0) + parseFloat(item.valor || 0);
      return acc;
    }, {});
  
    // Limitar a 20 produtos mais vendidos
    const top20Produtos = Object.entries(vendasPorProdutoData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20);
  
    const topProdutos = {
      labels: top20Produtos.map(([produtoId]) => {
        const item = itens.find((i) => i.produto_id === produtoId);
        const descricao = item ? item.descricao : produtoId;
        const nomeProduto = descricao.split(';')[0];
        return nomeProduto;
      }),
      datasets: [
        {
          label: 'Vendas',
          backgroundColor: '#46ad5a',
          data: top20Produtos.map(([, valor]) => valor),
        },
      ],
    };
  
    setVendasPorProduto(topProdutos);
  };
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  const horizontalChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <PrimeReactProvider>
      <CardHeader />
      <h1>Home</h1>
      <FilterBar onFilter={handleFilter} />

      <div className="card-container">
        {['Pedidos', 'Volume', 'Venda', 'Comissão'].map((title, index) => (
          <div className="card" key={title}>
            <div className="card-content">
              <div className="card-icon">
                <i className={`pi ${['pi-shopping-cart', 'pi-box', 'pi-dollar', 'pi-money-bill'][index]}`}></i>
              </div>
              <div className="card-info">
                <h3>{title}</h3>
                <span>
                  {index === 2 || index === 3
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(cardData[title.toLowerCase()] || 0)
                    : cardData[title.toLowerCase()] || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Venda x Dia */}
      {vendasPorDia && (
        <div className="chart-container">
          <h2>Venda x Dia</h2>
          <Chart type="bar" data={vendasPorDia} options={chartOptions} />
        </div>
      )}

      {/* Gráfico de Venda x Produto */}
      {vendasPorProduto && (
        <div className="chart-container">
          <h2>Venda x Produto</h2>
          <Chart type="bar" data={vendasPorProduto} options={horizontalChartOptions} />
        </div>
      )}

      <CardFooter />
    </PrimeReactProvider>
  );
};

export default HomePage;