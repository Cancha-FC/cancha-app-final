import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import './FilterBar.css'; // Estilos personalizados

const FilterBar = ({ onFilter }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLicensees, setSelectedLicensees] = useState([]); // Armazena os licenciados selecionados
    const [licensees, setLicensees] = useState([]); // Estado para os licenciados
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o campo de pesquisa
    const [modalVisible, setModalVisible] = useState(false); // Controle de visibilidade do modal

    useEffect(() => {
        // Função para buscar licenciados da API
        const fetchLicenciados = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/licenciados/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setLicensees(data);
            } catch (error) {
                console.error('Erro ao buscar licenciados:', error);
            }
        };

        fetchLicenciados();  // Chama a função ao montar o componente
    }, []);

    // Função para controlar a seleção de licenciados
    const onLicenseeSelect = (e, licenciado) => {
        const selected = [...selectedLicensees];
        if (e.checked) {
            selected.push(licenciado);
        } else {
            const index = selected.indexOf(licenciado);
            selected.splice(index, 1);
        }
        setSelectedLicensees(selected);
    };

    // Função chamada ao clicar no botão "Buscar"
    const handleSearch = () => {
        onFilter({ startDate, endDate, selectedLicensees });
    };

    // Filtro para o campo de pesquisa
    const filteredLicensees = licensees.filter((licenciado) => 
        licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Exibe o nome dos licenciados selecionados ou um resumo
    const getSelectedLicenseesLabel = () => {
        if (selectedLicensees.length === 1) {
            return selectedLicensees[0].nome; // Exibe o nome do único licenciado selecionado
        } else if (selectedLicensees.length > 1) {
            return `${selectedLicensees.length} licenciados selecionados`; // Exibe "X licenciados selecionados"
        } else {
            return "Selecionar Licenciados"; // Texto padrão se nenhum licenciado for selecionado
        }
    };

    return (
        <div className="filter-bar">
            {/* DatePicker para data de início */}
            <div className="calendar-container">
                <Calendar 
                    id="start"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.value)} 
                    placeholder="Selecione a data de início" 
                    showIcon 
                    touchUI={false} 
                    locale="pt-BR" 
                    dateFormat="dd/mm/yy"
                />
            </div>

            {/* DatePicker para data de fim */}
            <div className="calendar-container">
                <Calendar 
                    id="end"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.value)} 
                    placeholder="Selecione a data de fim" 
                    showIcon 
                    touchUI={false}
                    locale="pt-BR" 
                    dateFormat="dd/mm/yy"
                />
            </div>

            {/* Botão para abrir o modal de seleção de licenciados */}
            <div className="dropdown-licenciados">
                <Button label={getSelectedLicenseesLabel()} icon="pi pi-users" onClick={() => setModalVisible(true)} />
            </div>

            {/* Botão de busca */}
            <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} />

            {/* Modal para selecionar os licenciados */}
            <Dialog header="Seleção de Licenciados" visible={modalVisible} onHide={() => setModalVisible(false)} style={{ width: '50vw' }}>
                {/* Campo de pesquisa */}
                <span className="p-input-icon-left" style={{ marginBottom: '10px' }}>
                    <i className="pi pi-search" />
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar Licenciado" />
                </span>

                {/* Tabela com checkbox para selecionar licenciados */}
                <DataTable value={filteredLicensees}>
                    <Column body={(rowData) => (
                        <Checkbox
                            checked={selectedLicensees.some((l) => l.id === rowData.id)}
                            onChange={(e) => onLicenseeSelect(e, rowData)}
                        />
                    )} header="Selecionar" />
                    <Column field="nome" header="Nome" />
                    
                </DataTable>

                {/* Botão de confirmação */}
                <Button label="Confirmar" icon="pi pi-check" onClick={() => setModalVisible(false)} style={{ marginTop: '10px' }} />
            </Dialog>
        </div>
    );
};

export default FilterBar;
