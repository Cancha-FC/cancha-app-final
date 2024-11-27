/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css'; // Estilos para a página

const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Obtém a URL base do .env

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    codigoCategoria: '', // ID do licenciado para cálculo da comissão
  });

  const [licenciados, setLicenciados] = useState([]);
  const [vendasPorDia, setVendasPorDia] = useState(null);
  const [vendasPorProduto, setVendasPorProduto] = useState(null);
  const [rankingData, setRankingData] = useState(null); // Dados da API de ranking
  const [cardData, setCardData] = useState({
    pedidos: 0,
    volume: 0,
    venda: 0,
    comissao: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLicenciados();
  }, []);

  const fetchLicenciados = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users/me/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setLicenciados(data.licenciados || []);
    } catch (error) {
      console.error('Erro ao buscar licenciados:', error);
    }
  };

  const handleFilter = async (filterData) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterData,
    }));

    await fetchData(filterData);
    await fetchRanking(filterData); // Busca os dados de ranking
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

      const responseItens = await fetch(`${BASE_URL}/pedido-itens/?${params.toString()}`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
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

  const fetchRanking = async (filterData) => {
    try {
      const params = new URLSearchParams();
      if (filterData.startDate) params.append('start_date', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('end_date', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigo_categoria', filterData.codigoCategoria);

      const response = await fetch(`${BASE_URL}/ranking/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setRankingData(data); // Armazena os dados do ranking
    } catch (error) {
      console.error('Erro ao buscar dados de ranking:', error);
    }
  };

  const processCardData = (itens) => {
    const pedidosUnicos = new Set(itens.map((item) => item.idPedido));
    const totalVolume = itens.reduce((total, item) => total + parseFloat(item.quantidade || 0), 0);
    const totalVenda = itens.reduce((total, item) => total + parseFloat(item.valor || 0), 0);
    const totalComissao = itens.reduce((total, item) => {
      const licenciado = licenciados.find((l) => l.id === parseInt(item.codigoCategoria, 10));
      if (!licenciado) return total;

      const comissaoPercentual = parseFloat(licenciado.comissao) / 100;
      return total + parseFloat(item.valor || 0) * comissaoPercentual;
    }, 0);

    setCardData({
      pedidos: pedidosUnicos.size,
      volume: totalVolume,
      venda: totalVenda,
      comissao: totalComissao,
    });
  };

  const processGraphData = (itens) => {
    const vendasPorDiaData = itens.reduce((acc, item) => {
      const dia = new Date(item.pedido_data).toISOString().split('T')[0];
      acc[dia] = (acc[dia] || 0) + parseFloat(item.valor || 0);
      return acc;
    }, {});

    const vendasPorDiaOrdenadas = Object.entries(vendasPorDiaData).sort(
      ([dataA], [dataB]) => new Date(dataA) - new Date(dataB)
    );

    setVendasPorDia({
      labels: vendasPorDiaOrdenadas.map(([data]) =>
        new Date(data).toLocaleDateString('pt-BR')
      ),
      datasets: [
        {
          label: 'Vendas por Dia',
          backgroundColor: '#46ad5a',
          data: vendasPorDiaOrdenadas.map(([, valor]) => valor),
        },
      ],
    });
  };

  const processRankingGraph = () => {
    if (!rankingData) return null;

    const topProdutos = rankingData.slice(0, 20); // Top 20 produtos
    return {
      labels: topProdutos.map((item) => item.DescricaoResumida || `Produto ${item.idProdutoPai}`),
      datasets: [
        {
          label: 'Venda por Produto',
          backgroundColor: '#46ad5a',
          data: topProdutos.map((item) => item.total_valor),
        },
      ],
    };
  };

  const vendasPorRanking = processRankingGraph();

  return (
    <PrimeReactProvider>
      <CardHeader />
      <h1>Home</h1>
      <FilterBar onFilter={handleFilter} />

      <div className="card-container">
        {['Pedidos', 'Volume', 'Venda', 'Comissão'].map((title, index) => {
          const key = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const value = cardData[key];
          return (
            <div className="card" key={title}>
              <div className="card-content">
                <div className="card-icon">
                  <i className={`pi ${['pi-shopping-cart', 'pi-box', 'pi-dollar', 'pi-money-bill'][index]}`}></i>
                </div>
                <div className="card-info">
                  <h3>{title}</h3>
                  <span>
                    {['venda', 'comissao'].includes(key)
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(value || 0)
                      : value || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      

      <div>
        {vendasPorDia && (
          <div className="chart-container">
            <h2>Venda x Dia</h2>
            <Chart type="bar" data={vendasPorDia} options={{ responsive: true, maintainAspectRatio: false }} /> 
          </div>
        )}
        </div>

        <div>
        {vendasPorRanking && (
          <div className="chart-container">
            <h2>Venda x Produto (Ranking)</h2>
            <Chart type="bar" data={vendasPorRanking} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
          </div>
        )}        
      </div>

      <CardFooter />
    </PrimeReactProvider>
  );
};

export default HomePage;