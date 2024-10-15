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
    const [selectedLicensees, setSelectedLicensees] = useState([]); 
    const [licensees, setLicensees] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [dateModalVisible, setDateModalVisible] = useState(false); // Estado do modal de datas

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

    const handleSearch = () => {
        onFilter({ startDate, endDate, selectedLicensees });
    };

    const filteredLicensees = licensees.filter((licenciado) =>
        licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSelectedLicenseesLabel = () => {
        if (selectedLicensees.length === 1) {
            return selectedLicensees[0].nome; 
        } else if (selectedLicensees.length > 1) {
            return `${selectedLicensees.length} licenciados selecionados`; 
        } else {
            return "Selecionar Licenciados"; 
        }
    };

    return (
        <div className="filter-bar">
            {/* Botão para abrir o modal de datas */}
            <Button className="button-select" label="Selecionar Período" icon="pi pi-calendar" onClick={() => setDateModalVisible(true)} />

            {/* Botão para abrir o modal de seleção de licenciados */}
            <div className="dropdown-licenciados">
                <Button className="button-select" label={getSelectedLicenseesLabel()} icon="pi pi-users" onClick={() => setModalVisible(true)} />
            </div>

            {/* Botão de busca */}
            <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} />

            {/* Modal para selecionar o período de datas */}
            <Dialog header="Período de consulta" visible={dateModalVisible} onHide={() => setDateModalVisible(false)} style={{ width: '40vw' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div className="calendar-container">
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

                    <div className="calendar-container">
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

                <Button label="Confirmar" icon="pi pi-check" onClick={() => setDateModalVisible(false)} style={{ marginTop: '10px' }} />
            </Dialog>

            {/* Modal para selecionar os licenciados */}
            <Dialog header="Seleção de Licenciados" visible={modalVisible} onHide={() => setModalVisible(false)} style={{ width: '50vw' }}>
                <span className="p-input-icon-left" style={{ marginBottom: '10px' }}>
                    <i className="pi pi-search" />
                    <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar Licenciado" />
                </span>

                <DataTable value={filteredLicensees}>
                    <Column
                        body={(rowData) => (
                            <Checkbox
                                checked={selectedLicensees.some((l) => l.id === rowData.id)}
                                onChange={(e) => onLicenseeSelect(e, rowData)}
                            />
                        )}
                        header="Selecionar"
                    />
                    <Column field="nome" header="Nome" />
                </DataTable>

                <Button label="Confirmar" icon="pi pi-check" onClick={() => setModalVisible(false)} style={{ marginTop: '10px' }} />
            </Dialog>
        </div>
    );
};

export default FilterBar;
