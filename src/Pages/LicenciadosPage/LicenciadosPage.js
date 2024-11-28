/* eslint-disable */

import React, { useState, useEffect, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import CardFooter from "../../Components/footer";
import CardHeader from "../../Components/header";
import LicenciadoEditForm from "./LicenciadosEditarComissao/LicenciadosEditarComissao";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import "./LicenciadosPage.css";

const LicenciadosPage = () => {
  const [licenciados, setLicenciados] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedLicenciado, setSelectedLicenciado] = useState(null);
  const toast = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Base URL do backend

  useEffect(() => {
    fetchLicenciados();
  }, []);

  const fetchLicenciados = async () => {
    try {
      const response = await fetch(`${BASE_URL}/licenciados/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar licenciados.");
      }

      const data = await response.json();

      // Use 'data.results' para extrair os licenciados
      setLicenciados(data.results);
    } catch (error) {
      console.error("Erro ao buscar licenciados:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os licenciados.",
      });
    }
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ global: { value, matchMode: "contains" } });
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="header-licenciados">
        <div className="header-licenciados-titulo">
          <h3>Licenciados</h3>
        </div>
        <div className="header-licenciados-buscador">
          <span className="icon-licenciados">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Busca"
            />
          </span>
          <Button
            className="botao-inserir"
            icon="pi pi-plus"
            rounded
            severity="info"
            aria-label="User"
            tooltip="Importar Novos Licenciados"
          />
          <Button
            className="botao-excel"
            icon="pi pi-file-excel"
            rounded
            severity="success"
            aria-label="Search"
            tooltip="Exportar p/ Excel"
          />
        </div>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.ativo ? "Ativo" : "Inativo"}
      severity={rowData.ativo ? "success" : "danger"}
    />
  );

  const comissaoBodyTemplate = (rowData) => {
    return `${rowData.comissao}%`;
  };

  const toggleAtivo = async (licenciado) => {
    try {
      const updatedLicenciado = { ...licenciado, ativo: !licenciado.ativo };

      const response = await fetch(
        `${BASE_URL}/licenciados/${licenciado.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedLicenciado),
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível atualizar o status do licenciado.");
      }

      // Atualiza o estado localmente para melhorar a performance
      setLicenciados((prevLicenciados) =>
        prevLicenciados.map((l) =>
          l.id === licenciado.id ? { ...l, ativo: updatedLicenciado.ativo } : l
        )
      );

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Status do licenciado atualizado.",
      });
    } catch (error) {
      console.error("Erro ao atualizar status do licenciado:", error);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: error.message,
      });
    }
  };

  const actionBodyTemplateEditar = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          onClick={() => openEditModal(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyTemplateInativar = (rowData) => {
    return (
      <div>
        <Button
          icon={rowData.ativo ? "pi pi-eye-slash" : "pi pi-eye"}
          className="p-button-rounded p-button-text"
          onClick={() => toggleAtivo(rowData)}
          tooltip={rowData.ativo ? "Inativar" : "Ativar"}
          tooltipOptions={{ position: "top" }}
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
          rows={25}
          rowsPerPageOptions={[25, 50, 100]}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["id", "nome"]}
          emptyMessage="Nenhum licenciado encontrado."
        >
          <Column field="id" header="ID" sortable filter />
          <Column field="nome" header="Licenciado" sortable filter />
          <Column
            field="comissao"
            header="Comissão (%)"
            body={comissaoBodyTemplate}
            sortable
            filter
          />
          <Column field="ativo" header="Status" body={statusBodyTemplate} />
          <Column body={actionBodyTemplateEditar} header="Editar" />
          <Column body={actionBodyTemplateInativar} header="Ativar/Inativar" />
        </DataTable>
      </div>

      <div>
        <br></br>
        <br></br>
        <CardFooter />
      </div>

      <Dialog
        header="Editar Licenciado"
        visible={editVisible}
        onHide={closeEditModal}
      >
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
