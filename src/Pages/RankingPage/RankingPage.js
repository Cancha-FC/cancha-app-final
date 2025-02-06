/* eslint-disable */

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

  const [productRankingData, setProductRankingData] = useState([]);
  const [licenciadoRankingData, setLicenciadoRankingData] = useState([]); // Novo estado para ranking de licenciados
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    codigoCategoria: '',
  });
  const [viewType, setViewType] = useState('Produto'); // Alterna entre Licenciado e Produto
  const options = ['Licenciado', 'Produto'];

  useEffect(() => {
    if (viewType === 'Licenciado') {
      fetchLicenciadoRanking(filters);
    } else if (viewType === 'Produto') {
      fetchProductRanking(filters);
    }
  }, [viewType, filters]);

  const handleFilter = async (filterData) => {
    setFilters(filterData);
    if (viewType === 'Licenciado') {
      await fetchLicenciadoRanking(filterData);
    } else if (viewType === 'Produto') {
      await fetchProductRanking(filterData);
    }
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    return null;
  };

  const fetchLicenciadoRanking = async (filterData) => {
    try {
      const params = new URLSearchParams();
      if (filterData.startDate) params.append('start_date', formatDate(filterData.startDate));
      if (filterData.endDate) params.append('end_date', formatDate(filterData.endDate));
      if (filterData.codigoCategoria) params.append('codigo_categoria', filterData.codigoCategoria);

      const response = await fetch(`${BASE_URL}/licenciado-ranking/?${params.toString()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados do ranking de licenciados retornados:', data);
      setLicenciadoRankingData(data);
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
    return licenciadoRankingData.map((item) => ({
      nome: item.licenciado_nome, // Corrigido para usar o campo retornado pela API
      totalVolume: item.total_quantidade,
      totalReceita: item.total_receita,
    }));
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