import './CardHeader.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button'; // Adicione esta linha
        


const CardHeader = () => {
    return (
        <div class="header">
            <div class="menu">
            <Button icon="pi pi-bars" rounded text aria-label="Filter" />
            </div>

            <div class="titulo">
                <h1>CANCHA FC</h1>
            </div>

            <div class="botoes">
            <Button icon="pi pi-check" rounded text aria-label="Filter" />
            <Button icon="pi pi-user" rounded text raised severity="success" aria-label="Search" />
            <Button icon="pi pi-bookmark" rounded text severity="secondary" aria-label="Bookmark" />

            </div>
            
        </div>
    )
}




export default CardHeader;