import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import './RankingPage.css';

const RankingPage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [licenciados, setLicenciados] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [productRankingData, setProductRankingData] = useState([]); // Estado para armazenar dados do ranking de produtos
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    codigoCategoria: '',
  });
  const [viewType, setViewType] = useState('Licenciado'); // Alterna entre Licenciado e Produto
  const options = ['Licenciado', 'Produto'];

  useEffect(() => {
    if (viewType === 'Licenciado') {
      fetchLicenciados();
    }
  }, [viewType]);

  const fetchLicenciados = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users/me/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Erro ao buscar licenciados: ${response.status}`);
      }
      const data = await response.json();
      setLicenciados(data.licenciados || []);
    } catch (error) {
      console.error('Erro ao buscar licenciados:', error);
    }
  };

  const handleFilter = async (filterData) => {
    setFilters(filterData);
    if (viewType === 'Licenciado') {
      await fetchLicenciadosRanking(filterData);
    } else if (viewType === 'Produto') {
      await fetchProductRanking(filterData);
    }
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Retorna apenas a parte da data no formato YYYY-MM-DD
    }
    return null;
  };

  const fetchLicenciadosRanking = async (filterData) => {
    try {
      const params = new URLSearchParams();
      if (filterData.startDate) params.append('pedido_data__gte', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('pedido_data__lte', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigoCategoria', filterData.codigoCategoria);

      const response = await fetch(`${BASE_URL}/pedido-itens/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados do ranking de licenciados retornados:', data);
      setFilteredData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do ranking de licenciados:', error);
    }
  };

  const fetchProductRanking = async (filterData) => {
    try {
      const params = new URLSearchParams();
      if (filterData.startDate) params.append('start_date', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('end_date', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigo_categoria', filterData.codigoCategoria);

      const response = await fetch(`${BASE_URL}/ranking/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados do ranking de produtos retornados:', data);
      setProductRankingData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do ranking de produtos:', error);
    }
  };

  const processLicenciadosRanking = () => {
    const licenciadosMap = {};

    filteredData.forEach((item) => {
      const { codigoCategoria, quantidade, valor } = item;

      const licenciado = licenciados.find((l) => l.id === parseInt(codigoCategoria, 10));
      if (!licenciado) return;

      if (!licenciadosMap[codigoCategoria]) {
        licenciadosMap[codigoCategoria] = {
          nome: licenciado.nome,
          totalVolume: 0,
          totalReceita: 0,
        };
      }

      licenciadosMap[codigoCategoria].totalVolume += parseFloat(quantidade || 0);
      licenciadosMap[codigoCategoria].totalReceita += parseFloat(valor || 0);
    });

    return Object.values(licenciadosMap).sort((a, b) => b.totalVolume - a.totalVolume);
  };

  const processProdutosRanking = () => {
    return productRankingData.map((item) => ({
      nome: item.DescricaoResumida || `Produto ${item.idProdutoPai}`,
      totalVolume: item.total_quantidade,
      totalReceita: item.total_valor,
    }));
  };

  const rankingData =
    viewType === 'Licenciado' ? processLicenciadosRanking() : processProdutosRanking();

  return (
    <PrimeReactProvider>
      <CardHeader />
      <div className="ranking-top">
        <h1>Ranking</h1>
        <div className="ranking-top-seletor">
          <SelectButton value={viewType} onChange={(e) => setViewType(e.value)} options={options} />
        </div>
      </div>

      <FilterBar onFilter={handleFilter} />

      <div className="TabRanking">
        <DataTable value={rankingData} stripedRows paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
          <Column field="nome" header={viewType === 'Licenciado' ? 'Licenciado' : 'Produto'} sortable />
          <Column field="totalVolume" header="Volume de Vendas" sortable />
          <Column
            field="totalReceita"
            header="Receita"
            sortable
            body={(rowData) =>
              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.totalReceita)
            }
          />
        </DataTable>
      </div>
      <CardFooter />
    </PrimeReactProvider>
  );
};

export default RankingPage;