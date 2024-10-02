import { PrimeReactProvider } from 'primereact/api';
import './App.css';
import CardFooter from './Components/footer';


function App() {
  return (
    <PrimeReactProvider>
    <h1>Hello World</h1>


    <CardFooter/>

    </PrimeReactProvider>



  );
}

export default App;
