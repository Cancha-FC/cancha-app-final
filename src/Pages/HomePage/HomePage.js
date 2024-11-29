import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css';

const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    codigoCategoria: '', // ID do licenciado
  });

  const [cardData, setCardData] = useState({
    pedidos: 0,
    volume: 0,
    venda: 0,
    comissao: 0,
  });

  const [receitaDiaria, setReceitaDiaria] = useState(null);
  const [rankingProdutos, setRankingProdutos] = useState(null); // Dados do ranking de produtos

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(filters);
    fetchRanking(filters); // Busca o ranking ao carregar
  }, []);

  const handleFilter = async (filterData) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterData,
    }));
    await fetchData(filterData);
    await fetchRanking(filterData); // Atualiza o ranking ao aplicar filtros
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
  
      // Extrai ano, mês e dia no fuso horário local
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Mês começa de 0
      const day = String(d.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    }
    return null;
  };
  

  const fetchData = async (filterData) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filterData.startDate) params.append('start_date', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('end_date', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigo_categoria', filterData.codigoCategoria);

      // Fetch total metrics
      const metricsResponse = await fetch(`${BASE_URL}/total-metrics/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      const metricsData = await metricsResponse.json();
      processCardData(metricsData);

      // Fetch receita diária
      const receitaResponse = await fetch(`${BASE_URL}/receita-diaria/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      const receitaData = await receitaResponse.json();
      processReceitaDiaria(receitaData);
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
      processRankingData(data); // Atualiza os dados de ranking
    } catch (error) {
      console.error('Erro ao buscar ranking de produtos:', error);
    }
  };

  const processCardData = (data) => {
    const { total_pedidos, total_quantidade, total_valor, total_comissao } = data;
    setCardData({
      pedidos: total_pedidos || 0,
      volume: total_quantidade || 0,
      venda: total_valor || 0,
      comissao: total_comissao || 0,
    });
  };

  const processReceitaDiaria = (data) => {
    const sortedData = data.sort((a, b) => new Date(a.data_pedido) - new Date(b.data_pedido));
  
    setReceitaDiaria({
      labels: sortedData.map((item) => {
        const date = new Date(item.data_pedido);
  
        // Adiciona o deslocamento do fuso horário para ajustar a data corretamente
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  
        // Formata para o formato desejado
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      }),
      datasets: [
        {
          label: 'Receita Diária',
          backgroundColor: '#46ad5a',
          data: sortedData.map((item) => item.total_receita),
        },
      ],
    });
  };
  
  

  const processRankingData = (data) => {
    const topProdutos = data.slice(0, 10); // Top 10 produtos
    setRankingProdutos({
      labels: topProdutos.map((item) => item.DescricaoResumida || `Produto ${item.idProdutoPai}`),
      datasets: [
        {
          label: 'Venda por Produto',
          backgroundColor: '#46ad5a',
          data: topProdutos.map((item) => item.total_valor),
        },
      ],
    });
  };

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
        {receitaDiaria && (
          <div className="chart-container">
            <h2>Receita Diária</h2>
            <Chart type="bar" data={receitaDiaria} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
      </div>

      <div>
        {rankingProdutos && (
          <div className="chart-container">
            <h2>Ranking de Produtos</h2>
            <Chart type="bar" data={rankingProdutos} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
          </div>
        )}
      </div>

      <CardFooter />
    </PrimeReactProvider>
  );
};

export default HomePage;