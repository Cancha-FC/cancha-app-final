import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { addLocale } from 'primereact/api';
import './FilterBar.css'; // Estilos personalizados

// Configuração de localização do PrimeReact
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
    const BASE_URL = process.env.REACT_APP_BACKEND_URL;

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLicensees, setSelectedLicensees] = useState([]);
    const [licensees, setLicensees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [allSelected, setAllSelected] = useState(false);

    // Função para buscar dados do usuário e iniciar os filtros
    useEffect(() => {
        const fetchAndFilterData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/auth/users/me/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) throw new Error('Erro ao buscar dados do usuário.');

                const data = await response.json();
                const licenciados = data.licenciados || [];

                setLicensees(licenciados);

                // Seleciona todos os IDs de licenciados por padrão
                const licenseeIds = licenciados.map((licenciado) => licenciado.id);
                setSelectedLicensees(licenseeIds);
                setAllSelected(true);

                // Configura a data inicial e final para o dia anterior
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                setStartDate(yesterday);
                setEndDate(yesterday);

                // Realiza a busca inicial automaticamente
                handleSearch(yesterday, yesterday, licenseeIds);
            } catch (error) {
                console.error('Erro ao buscar licenciados:', error.message);
            }
        };

        fetchAndFilterData();
    }, [BASE_URL]);

    // Função para realizar a consulta
    const handleSearch = useCallback(
        (start = startDate, end = endDate, licensees = selectedLicensees) => {
            const codigoCategoria = licensees.join(',');

            onFilter({
                startDate: start,
                endDate: end,
                codigoCategoria,
            });
        },
        [onFilter, startDate, endDate, selectedLicensees]
    );

    // Seleção de licenciados
    const onLicenseeSelect = (e, licenciado) => {
        const selected = [...selectedLicensees];
        if (e.checked) {
            selected.push(licenciado.id);
        } else {
            const index = selected.indexOf(licenciado.id);
            selected.splice(index, 1);
        }
        setSelectedLicensees(selected);
    };

    // Seleção de todos os licenciados filtrados
    const selectAllLicensees = (e) => {
        if (e.checked) {
            const filteredLicensees = licensees
                .filter((licenciado) => licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((licenciado) => licenciado.id);
            setSelectedLicensees(filteredLicensees);
            setAllSelected(true);
        } else {
            setSelectedLicensees([]);
            setAllSelected(false);
        }
    };

    // Filtra licenciados pelo termo de pesquisa
    const filteredLicensees = licensees.filter((licenciado) =>
        licenciado.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSelectedLicenseesLabel = () => {
        if (selectedLicensees.length === 1) {
            const licenciado = licensees.find((l) => l.id === selectedLicensees[0]);
            return licenciado ? licenciado.nome : 'Selecionar Licenciados';
        } else if (selectedLicensees.length > 1) {
            return `${selectedLicensees.length} licenciados selecionados`;
        } else {
            return 'Selecionar Licenciados';
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
            <Button
                className="button-select"
                label={getPeriodLabel()}
                icon="pi pi-calendar"
                onClick={() => setDateModalVisible(true)}
            />

            <div className="dropdown-licenciados">
                <Button
                    className="button-select"
                    label={getSelectedLicenseesLabel()}
                    icon="pi pi-users"
                    onClick={() => setModalVisible(true)}
                />
            </div>

            <Button label="Buscar" icon="pi pi-search" onClick={() => handleSearch()} />

            <Dialog
                className="popup-seleciona-data"
                header="Período de consulta"
                visible={dateModalVisible}
                onHide={() => setDateModalVisible(false)}
            >
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

                <Button
                    label="Confirmar"
                    icon="pi pi-check"
                    onClick={() => setDateModalVisible(false)}
                    className="confirm-button"
                />
            </Dialog>

            <Dialog
                header="Seleção de Licenciados"
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                style={{ width: '50vw' }}
            >
                <span className="p-input-icon-left" style={{ marginBottom: '10px', width: '100%' }}>
                    <i className="pi pi-search" />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar Licenciado"
                        style={{ width: '100%' }}
                    />
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

                <Button
                    label="Confirmar"
                    icon="pi pi-check"
                    onClick={() => setModalVisible(false)}
                    style={{ marginTop: '10px' }}
                />
            </Dialog>
        </div>
    );
};

export default FilterBar;