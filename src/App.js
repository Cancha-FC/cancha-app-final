import { PrimeReactProvider } from 'primereact/api';
import './App.css';
import CardFooter from './Components/footer';
import CardHeader from './Components/header';


function App() {
  return (
    <PrimeReactProvider>
    
    <div>
    <CardHeader/>
    </div>
    

    <h1>Hello World</h1>

    <div>
    <CardFooter/>
    </div>
    

    </PrimeReactProvider>



  );
}

export default App;
