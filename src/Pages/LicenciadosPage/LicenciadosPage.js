import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import CardFooter from '../../Components/footer'; // Importa o footer
import CardHeader from '../../Components/header'; // Importa o header
import CustomerService from '../../service/CustomerService'; // Certifique-se que o caminho está correto
import './LicenciadosPage.css';

const LicenciadosPage = () => {
  const [licenciados, setLicenciados] = useState([]); // Renomeado para licenciados
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
  });

  useEffect(() => {
    fetchLicenciados(); // Chama a função para buscar licenciados ao iniciar o componente
  }, []);

  const fetchLicenciados = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/licenciados/'); // URL da sua API
      const data = await response.json();
      setLicenciados(data); // Define os licenciados recebidos na API
    } catch (error) {
      console.error('Erro ao buscar licenciados:', error);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ global: { value, matchMode: 'contains' } });
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h4 className="m-0">Licenciados</h4>
        <span className="p-input-icon-right">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca" />
        </span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => (
    <Tag value={rowData.ativo ? 'Ativo' : 'Inativo'} severity={rowData.ativo ? 'success' : 'danger'} />
  );

  const header = renderHeader();

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="TabLicenciados">
        <DataTable 
          value={Array.isArray(licenciados) ? licenciados : []}
          paginator 
          header={header} 
          rows={20} 
          rowsPerPageOptions={[20, 50, 100]} 
          filters={filters} 
          filterDisplay="menu" 
          globalFilterFields={['id', 'nome']} // Ajuste os campos conforme necessário
          emptyMessage="Nenhum licenciados encontrado."
        >
          <Column field="id" header="ID" sortable filter />
          <Column field="nome" header="Nome" sortable filter />
          <Column field="ativo" header="Status" body={statusBodyTemplate} />
        </DataTable>
      </div>

      <div>
        <CardFooter />
      </div>
    </PrimeReactProvider>
  );
};

export default LicenciadosPage;