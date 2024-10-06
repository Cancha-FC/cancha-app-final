// import { PrimeReactProvider } from 'primereact/api';
// import './App.css';
// import CardFooter from './Components/footer';
// import CardHeader from './Components/header';


// function App() {
//   return (
//     <PrimeReactProvider>
    
//     <div>
//     <CardHeader/>
//     </div>
    

//     <h1>Hello World</h1>

//     <div>
//     <CardFooter/>
//     </div>
    

//     </PrimeReactProvider>



//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarMenu from './Components/SidebarMenu/SidebarMenu'; // Seu menu lateral
import HomePage from './Pages/HomePage/HomePage'; // Páginas diferentes
import RankingPage from './Pages/RankingPage/RankingPage';
import UsuariosPage from './Pages/UsuarioPages/UsuarioPage';
import LicenciadosPages from './Pages/LicenciadosPage/LicenciadosPage';
import LoginPage from './Pages/Login/login.js'

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/licenciados" element={<LicenciadosPages />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

