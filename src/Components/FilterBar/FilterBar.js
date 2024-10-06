import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { addLocale } from 'primereact/api';
import './FilterBar.css'; // Estilos personalizados

// Adicionando a configuração do locale para pt-BR
addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
});

const FilterBar = ({ onFilter }) => {
    const [startDate, setStartDate] = useState(null); // Estado para a data de início
    const [endDate, setEndDate] = useState(null);     // Estado para a data de fim
    const [selectedLicensee, setSelectedLicensee] = useState(null); // Estado para o dropdown de licenciados

    // Lista de licenciados (exemplo)
    const licensees = [
        { label: 'Licenciado 1', value: 'licenciado1' },
        { label: 'Licenciado 2', value: 'licenciado2' },
        { label: 'Licenciado 3', value: 'licenciado3' },
    ];

    // Função chamada ao clicar no botão "Buscar"
    const handleSearch = () => {
        onFilter({ startDate, endDate, selectedLicensee });
    };

    return (
        <div className="filter-bar">
            {/* DatePicker para data de início */}
            <div className="calendar-container">
                {/* <label htmlFor="start">Data de Início</label> */}
                <Calendar 
                    id="start"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.value)} 
                    placeholder="Selecione a data de início" 
                    showIcon 
                    touchUI={false} // Evitar comportamento de tela cheia em desktop
                    locale="pt-BR" // Define o locale para português
                    dateFormat="dd/mm/yy" // Formato de data
                />
            </div>

            {/* DatePicker para data de fim */}
            <div className="calendar-container">
                {/* <label htmlFor="end">Data de Fim</label> */}
                <Calendar 
                    id="end"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.value)} 
                    placeholder="Selecione a data de fim" 
                    showIcon 
                    touchUI={false} // Evitar comportamento de tela cheia em desktop
                    locale="pt-BR" // Define o locale para português
                    dateFormat="dd/mm/yy" // Formato de data
                />
            </div>

            {/* Dropdown para selecionar licenciados */}
            <Dropdown 
                value={selectedLicensee} 
                options={licensees} 
                onChange={(e) => setSelectedLicensee(e.value)} 
                placeholder="Selecione o licenciado" 
                showClear 
                style={{ width: '100%' }}
            />

            {/* Botão de busca */}
            <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} />
        </div>
    );
};

export default FilterBar;
