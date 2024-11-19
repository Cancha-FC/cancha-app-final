import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import FilterBar from '../../Components/FilterBar/FilterBar'; // Componente de filtro
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import './RankingPage.css';

const RankingPage = () => {
  const [licenciados, setLicenciados] = useState([]);
  const [filters, setFilters] = useState({});
  const options = ['Licenciado', 'Produto'];  // Opções do SelectButton
  const [value, setValue] = useState(options[0]); // Estado inicial como "Licenciado"

  // Função para buscar o ranking de licenciados
  const fetchLicenciadosRanking = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append('pedido_data__gte', filters.startDate);
      if (filters.endDate) params.append('pedido_data__lte', filters.endDate);
      if (filters.selectedLicensee) params.append('codigoCategoria', filters.selectedLicensee); // Filtro por licenciado

      const response = await fetch(`http://127.0.0.1:8000/api/pedido-itens/?${params.toString()}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      // Processando os dados para calcular o ranking de licenciados
      const ranking = processRanking(data);
      setLicenciados(ranking);
    } catch (error) {
      console.error('Erro ao buscar o ranking de licenciados:', error);
    }
  };

  // Função para processar os dados de pedidos e calcular o ranking de licenciados
  const processRanking = (pedidoItens) => {
    const licenciadosMap = {};

    pedidoItens.forEach((item) => {
      const { codigoCategoria, quantidade, valor, codigoCategoria__nome } = item;

      // Se o licenciado já existe no map, atualiza os valores
      if (!licenciadosMap[codigoCategoria]) {
        licenciadosMap[codigoCategoria] = {
          nome: codigoCategoria__nome, // Nome do licenciado
          totalVolume: 0,
          totalReceita: 0, // Adicionando a receita
        };
      }

      // Acumulando o volume (quantidade de produtos vendidos) e a receita
      licenciadosMap[codigoCategoria].totalVolume += parseFloat(quantidade || 0);
      licenciadosMap[codigoCategoria].totalReceita += parseFloat(valor || 0);
    });

    // Convertendo o map para um array e ordenando pelo volume de vendas
    return Object.values(licenciadosMap).sort((a, b) => b.totalVolume - a.totalVolume);
  };

  // Filtro de dados
  useEffect(() => {
    fetchLicenciadosRanking();
  }, [filters]);

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="ranking-top">
        <h1>Ranking</h1>
        <div className="ranking-top-seletor">
          <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
        </div>
      </div>

      {/* Componente FilterBar */}
      <FilterBar onFilter={handleFilter} />

      {/* Renderização condicional das tabelas */}
      <div className="TabRanking">
        {value === 'Licenciado' && (
          <DataTable value={licenciados} stripedRows tableStyle={{ minWidth: '50rem' }}>
            <Column field="nome" header="Licenciado" sortable filter />
            <Column field="totalVolume" header="Volume de Vendas" sortable filter />
            <Column field="totalReceita" header="Receita" sortable filter />
          </DataTable>
        )}

        {value === 'Produto' && (
          // Aqui você pode adicionar a lógica do ranking de produtos, se necessário
          <div>Ranking de Produtos ainda não implementado.</div>
        )}
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default RankingPage;