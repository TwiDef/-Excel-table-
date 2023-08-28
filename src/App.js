import './App.css';
import Excel from './components/Excel/Excel';
import { store } from './data';
import logo from './logo.svg';

function App() {
    return (
        <div className="App">
            {/* HEADER */}
            <header>
                <img src={logo} width={100} height={100} alt="" className='logo' />
                <h1>Excel table</h1>
            </header>
            {/* HEADER */}
            <Excel headers={store.headers} initialData={store.data} />
        </div>
    );
}

export default App;
