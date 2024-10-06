import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './FilterBar.css'; // Estilos personalizados

const FilterBar = ({ onFilter }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLicensee, setSelectedLicensee] = useState(null);

    // Lista de licenciados (exemplo)
    const licensees = [
        { label: 'Licenciado 1', value: 'licenciado1' },
        { label: 'Licenciado 2', value: 'licenciado2' },
        { label: 'Licenciado 3', value: 'licenciado3' },
    ];

    const handleSearch = () => {
        onFilter({ startDate, endDate, selectedLicensee });
    };

    return (
        <div className="filter-bar">
            {/* DatePicker para data de início */}
            <div className="calendar-container">
                <label htmlFor="start">Data de Início</label>
                <Calendar 
                    id="start"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.value)} 
                    placeholder="Selecione a data de início" 
                    showIcon 
                />
            </div>

            {/* DatePicker para data de fim */}
            <div className="calendar-container">
                <label htmlFor="end">Data de Fim</label>
                <Calendar 
                    id="end"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.value)} 
                    placeholder="Selecione a data de fim" 
                    showIcon 
                />
            </div>

            {/* Dropdown para selecionar licenciados */}
            <Dropdown 
                value={selectedLicensee} 
                options={licensees} 
                onChange={(e) => setSelectedLicensee(e.value)} 
                placeholder="Selecione o licenciado" 
                showClear 
            />

            {/* Botão de busca */}
            <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} />
        </div>
    );
};

export default FilterBar;
