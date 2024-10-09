// LicenciadosPage.js

import React, { useState, useEffect, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import CardFooter from '../../Components/footer';
import CardHeader from '../../Components/header';
import LicenciadoEditForm from '../../Components/LicenciadoEditForm/LicenciadoEditForm';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';

const LicenciadosPage = () => {
  const [licenciados, setLicenciados] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedLicenciado, setSelectedLicenciado] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchLicenciados();
  }, []);

  const fetchLicenciados = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/licenciados/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setLicenciados(data);
    } catch (error) {
      console.error('Erro ao buscar licenciados:', error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os licenciados.' });
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

  const comissaoBodyTemplate = (rowData) => {
    return `${rowData.comissao}%`;
  };

  const toggleAtivo = async (licenciado) => {
    try {
      const updatedLicenciado = { ...licenciado, ativo: !licenciado.ativo };

      const response = await fetch(`http://127.0.0.1:8000/api/licenciados/${licenciado.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedLicenciado),
      });

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status do licenciado.');
      }

      // Atualiza o estado localmente para melhorar a performance
      setLicenciados((prevLicenciados) =>
        prevLicenciados.map((l) =>
          l.id === licenciado.id ? { ...l, ativo: updatedLicenciado.ativo } : l
        )
      );

      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Status do licenciado atualizado.' });
    } catch (error) {
      console.error('Erro ao atualizar status do licenciado:', error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          onClick={() => openEditModal(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon={rowData.ativo ? 'pi pi-eye-slash' : 'pi pi-eye'}
          className="p-button-rounded p-button-text"
          onClick={() => toggleAtivo(rowData)}
          tooltip={rowData.ativo ? 'Inativar' : 'Ativar'}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  const openEditModal = (licenciado) => {
    setSelectedLicenciado(licenciado);
    setEditVisible(true);
  };

  const closeEditModal = () => {
    setEditVisible(false);
    setSelectedLicenciado(null);
    // Atualiza a lista após fechar o modal, se necessário
    fetchLicenciados();
  };

  const header = renderHeader();

  return (
    <PrimeReactProvider>
      <div>
        <CardHeader />
      </div>

      <div className="TabLicenciados">
        <DataTable
          value={licenciados}
          paginator
          header={header}
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={['id', 'nome']}
          emptyMessage="Nenhum licenciado encontrado."
        >
          <Column field="id" header="ID" sortable filter />
          <Column field="nome" header="Nome" sortable filter />
          <Column field="comissao" header="Comissão" body={comissaoBodyTemplate} sortable filter />
          <Column field="ativo" header="Status" body={statusBodyTemplate} />
          <Column body={actionBodyTemplate} header="Ações" />
        </DataTable>
      </div>

      <div>
        <CardFooter />
      </div>

      <Dialog header="Editar Licenciado" visible={editVisible} onHide={closeEditModal}>
        {selectedLicenciado && (
          <LicenciadoEditForm
            licenciado={selectedLicenciado}
            onClose={closeEditModal}
          />
        )}
      </Dialog>

      <Toast ref={toast} />
    </PrimeReactProvider>
  );
};

export default LicenciadosPage;