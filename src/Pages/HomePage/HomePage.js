import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import CardFooter from '../../Components/footer'; // Importa automaticamente o index.js da pasta footer
import CardHeader from '../../Components/header'; // Importa automaticamente o index.js da pasta header



const HomePage = () => {
  return (
    <PrimeReactProvider>
    
    <div>
    <CardHeader/>
    </div>
    

    <h1>Home</h1>

    <div>
    <CardFooter/>
    </div>
    

    </PrimeReactProvider>



  );
}

export default HomePage;
