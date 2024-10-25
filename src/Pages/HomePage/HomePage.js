import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css'; // Importar o CSS para estilização

const HomePage = () => {
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0], // Data atual formatada como YYYY-MM-DD
    endDate: new Date().toISOString().split('T')[0],   // Data atual formatada como YYYY-MM-DD
  });
  const [vendasPorDia, setVendasPorDia] = useState(null);
  const [vendasPorProduto, setVendasPorProduto] = useState(null);
  const [cardData, setCardData] = useState({
    pedidos: 0,
    volume: 0,
    venda: 0,
    comissao: 0,
  });

  // Função chamada quando o filtro é aplicado
  const handleFilter = (filterData) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterData, // Atualiza filtros conforme o selecionado pelo usuário
    }));
  };

  // Função para formatar a data como YYYY-MM-DD
  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];  // Formato YYYY-MM-DD
    }
    return null;
  };

  // Função para buscar os dados da API com base nos filtros
  const fetchData = async () => {
    try {
      const params = new URLSearchParams();

      // Adicionar filtros de data como parâmetros no formato correto
      if (filters.startDate) {
        params.append('data_gte', formatDate(filters.startDate));
      }
      if (filters.endDate) {
        params.append('data_lte', formatDate(filters.endDate));
      }

      // Adicionar filtros de produto e licenciado como parâmetros de busca
      if (filters.product) {
        params.append('search', filters.product); // Filtrar por produto
      }
      if (filters.licenciado) {
        params.append('search', filters.licenciado); // Filtrar por licenciado
      }

      const responsePedidos = await fetch(`http://127.0.0.1:8000/api/pedidos/?${params.toString()}`, {
        headers: {
          'Authorization': 'Basic YWRtaW46MQ==',  // Autenticação
          'X-CSRFToken': 'seu_csrf_token_aqui',
        },
      });

      const responseItens = await fetch(`http://127.0.0.1:8000/api/pedido-itens/?${params.toString()}`, {
        headers: {
          'Authorization': 'Basic YWRtaW46MQ==',  // Autenticação
          'X-CSRFToken': 'seu_csrf_token_aqui',
        },
      });

      const dataPedidos = await responsePedidos.json();
      const dataItens = await responseItens.json();

      if (!Array.isArray(dataPedidos)) {
        throw new Error("Erro ao buscar pedidos: resposta inesperada");
      }

      // Processando dados de pedidos para popular os gráficos e cards
      const pedidosCount = dataPedidos.length;
      const totalVolume = dataPedidos.reduce((total, pedido) => total + parseFloat(pedido.totalProdutos || 0), 0);
      const totalVenda = dataPedidos.reduce((total, pedido) => total + parseFloat(pedido.total || 0), 0);
      const totalComissao = dataPedidos.reduce((total, pedido) => total + parseFloat(pedido.taxaComissao || 0), 0);

      setCardData({
        pedidos: pedidosCount,
        volume: totalVolume,
        venda: totalVenda,
        comissao: totalComissao,
      });

      // Configurando o gráfico de vendas por dia
      const vendasPorDiaData = {}; // Objeto para acumular vendas por dia
      dataPedidos.forEach((pedido) => {
        const dia = new Date(pedido.data).toLocaleDateString();
        if (!vendasPorDiaData[dia]) {
          vendasPorDiaData[dia] = 0;
        }
        vendasPorDiaData[dia] += parseFloat(pedido.total || 0);
      });

      setVendasPorDia({
        labels: Object.keys(vendasPorDiaData),
        datasets: [
          {
            label: 'Vendas',
            backgroundColor: '#46ad5a',
            data: Object.values(vendasPorDiaData),
          },
        ],
      });

      // Configurando o gráfico de vendas por produto com base nos itens de pedidos
      const vendasPorProdutoData = {}; // Objeto para acumular vendas por produto
      dataItens.forEach((item) => {
        if (!vendasPorProdutoData[item.descricao]) {
          vendasPorProdutoData[item.descricao] = 0;
        }
        vendasPorProdutoData[item.descricao] += parseFloat(item.valor || 0);
      });

      setVendasPorProduto({
        labels: Object.keys(vendasPorProdutoData),
        datasets: [
          {
            label: 'Vendas',
            backgroundColor: '#46ad5a',
            data: Object.values(vendasPorProdutoData),
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função chamada ao montar o componente
  useEffect(() => {
    fetchData(); // Buscar dados automaticamente quando a página carregar
  }, [filters]);

  // Opções para o gráfico de barras verticais
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Opções para o gráfico de barras horizontais
  const horizontalChartOptions = {
    indexAxis: 'y', // Muda para barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <h1>Home</h1>

      {/* Adicionando o componente FilterBar */}
      <FilterBar onFilter={handleFilter} />

      {/* Adicionando os Cards */}
      <div className="card-container">
        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-shopping-cart"></i>
            </div>
            <div className="card-info">
              <h3>Pedidos</h3>
              <span>{cardData.pedidos}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-box"></i>
            </div>
            <div className="card-info">
              <h3>Volume</h3>
              <span>{cardData.volume}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-dollar"></i>
            </div>
            <div className="card-info">
              <h3>Venda</h3>
              <span>R${cardData.venda}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <i className="pi pi-money-bill"></i>
            </div>
            <div className="card-info">
              <h3>Comissão</h3>
              <span>R${cardData.comissao}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Venda x Dia */}
      <div className="chart-container">
        <h2>Venda x Dia</h2>
        {vendasPorDia ? <Chart type="bar" data={vendasPorDia} options={chartOptions} /> : 'Carregando dados...'}
      </div>

      {/* Gráfico de Venda x Produto - Barras Horizontais */}
      <div className="chart-container">
        <h2>Venda x Produto</h2>
        {vendasPorProduto ? <Chart type="bar" data={vendasPorProduto} options={horizontalChartOptions} /> : 'Carregando dados...'}
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default HomePage;