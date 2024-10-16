import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Chart } from 'primereact/chart';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import './HomePage.css'; // Importar o CSS para estilização

const HomePage = () => {
  const [filters, setFilters] = useState({});
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
    setFilters(filterData);
  };

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const responseDia = await fetch('http://127.0.0.1:8000/api/vendas/dia/'); // Endpoint para vendas por dia
      const responseProduto = await fetch('http://127.0.0.1:8000/api/vendas/produto/'); // Endpoint para vendas por produto
      const responseCards = await fetch('http://127.0.0.1:8000/api/vendas/cards/'); // Endpoint para dados dos cards

      const dataDia = await responseDia.json();
      const dataProduto = await responseProduto.json();
      const dataCards = await responseCards.json();

      setVendasPorDia({
        labels: dataDia.map((item) => item.dia),
        datasets: [
          {
            label: 'Vendas',
            backgroundColor: '#46ad5a',
            data: dataDia.map((item) => item.vendas)
          }
        ]
      });

      setVendasPorProduto({
        labels: dataProduto.map((item) => item.produto),
        datasets: [
          {
            label: 'Vendas',
            backgroundColor: '#46ad5a',
            data: dataProduto.map((item) => item.vendas)
          }
        ]
      });

      setCardData({
        pedidos: dataCards.pedidos,
        volume: dataCards.volume,
        venda: dataCards.venda,
        comissao: dataCards.comissao,
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função chamada ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  // Opções para o gráfico de barras verticais
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Opções para o gráfico de barras horizontais
  const horizontalChartOptions = {
    indexAxis: 'y', // Muda para barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
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