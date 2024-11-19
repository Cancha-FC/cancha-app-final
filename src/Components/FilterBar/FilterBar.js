import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { addLocale } from 'primereact/api';
import './FilterBar.css'; // Estilos personalizados

addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar',
});

const FilterBar = ({ onFilter }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLicensees, setSelectedLicensees] = useState([]); // IDs dos licenciados selecionados
    const [licensees, setLicensees] = useState([]); // Lista de licenciados retornada da API
    const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa
    const [modalVisible, setModalVisible] = useState(false); // Controle do modal de licenciados
    const [dateModalVisible, setDateModalVisible] = useState(false); // Controle do modal de datas
    const [allSelected, setAllSelected] = useState(false); // Controle da seleção de todos os licenciados

    useEffect(() => {
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

        fetchLicenciados();
    }, []);

    // Função para controlar a seleção de licenciados
    const onLicenseeSelect = (e, licenciado) => {
        const selected = [...selectedLicensees];
        if (e.checked) {
            selected.push(licenciado.id); // Adiciona o ID
        } else {
            const index = selected.indexOf(licenciado.id);
            selected.splice(index, 1);
        }
        setSelectedLicensees(selected);
    };

    // Função para selecionar todos os licenciados filtrados
    const selectAllLicensees = (e) => {
        if (e.checked) {
            const filteredLicensees = licensees
                .filter((licenciado) => licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((licenciado) => licenciado.id); // Seleciona apenas os IDs
            setSelectedLicensees(filteredLicensees);
            setAllSelected(true);
        } else {
            setSelectedLicensees([]);
            setAllSelected(false);
        }
    };

    const handleSearch = () => {
        // Converte os IDs dos licenciados selecionados em uma string separada por vírgulas
        const codigoCategoria = selectedLicensees.join(',');
    
        // Envia os filtros, incluindo o `codigoCategoria`
        onFilter({
            startDate,
            endDate,
            codigoCategoria, // IDs dos licenciados como `codigoCategoria`
        });
    };

    const filteredLicensees = licensees.filter((licenciado) =>
        licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSelectedLicenseesLabel = () => {
        if (selectedLicensees.length === 1) {
            // Exibe o nome do primeiro licenciado selecionado
            const licenciado = licensees.find((l) => l.id === selectedLicensees[0]);
            return licenciado ? licenciado.nome : "Selecionar Licenciados";
        } else if (selectedLicensees.length > 1) {
            return `${selectedLicensees.length} licenciados selecionados`;
        } else {
            return "Selecionar Licenciados";
        }
    };

    const getPeriodLabel = () => {
        if (startDate && endDate) {
            const start = startDate.toLocaleDateString('pt-BR');
            const end = endDate.toLocaleDateString('pt-BR');
            return `${start} a ${end}`;
        } else {
            return 'Selecionar Período';
        }
    };

    return (
        <div className="filter-bar">
            {/* Botão para abrir o modal de datas */}
            <Button className="button-select" label={getPeriodLabel()} icon="pi pi-calendar" onClick={() => setDateModalVisible(true)} />

            {/* Botão para abrir o modal de seleção de licenciados */}
            <div className="dropdown-licenciados">
                <Button className="button-select" label={getSelectedLicenseesLabel()} icon="pi pi-users" onClick={() => setModalVisible(true)} />
            </div>

            {/* Botão de busca */}
            <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} />

            {/* Modal para selecionar o período de datas */}
            <Dialog className="popup-seleciona-data" header="Período de consulta" visible={dateModalVisible} onHide={() => setDateModalVisible(false)}>
                <div className="popup-seleciona-data-datas">
                    <div className="input-wrapper">
                        <label htmlFor="start">Início</label>
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

                    <div className="input-wrapper">
                        <label htmlFor="end">Fim</label>
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
                </div>

                <Button label="Confirmar" icon="pi pi-check" onClick={() => setDateModalVisible(false)} className="confirm-button" />
            </Dialog>

            {/* Modal para selecionar os licenciados */}
            <Dialog header="Seleção de Licenciados" visible={modalVisible} onHide={() => setModalVisible(false)} style={{ width: '50vw' }}>
                <span className="p-input-icon-left" style={{ marginBottom: '10px', width: '100%' }}>
                    <i className="pi pi-search" />
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar Licenciado" style={{ width: '100%' }} />
                </span>

                <DataTable value={filteredLicensees}>
                    <Column
                        header={
                            <Checkbox
                                checked={allSelected}
                                onChange={selectAllLicensees}
                            />
                        }
                        body={(rowData) => (
                            <Checkbox
                                checked={selectedLicensees.includes(rowData.id)}
                                onChange={(e) => onLicenseeSelect(e, rowData)}
                            />
                        )}
                        headerStyle={{ width: '3em' }}
                    />
                    <Column field="nome" header="Nome" />
                </DataTable>

                <Button label="Confirmar" icon="pi pi-check" onClick={() => setModalVisible(false)} style={{ marginTop: '10px' }} />
            </Dialog>
        </div>
    );
};

export default FilterBar;