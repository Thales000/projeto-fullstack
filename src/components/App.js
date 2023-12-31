import React from 'react';
import Footer from './Footer';
import Header from './Header';
import MainBuscar from './MainBuscar';
import MainInserir from './MainInserir';
import MainLogin from './MainLogin';
import MainCadastrar from './MainCadastrar';
import MainPerfil from './MainPerfil';
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <DataProvider>
          <Header />
          <Routes>
            <Route path="/buscar" element={<MainBuscar />} />
            <Route path="/inserir" element={<MainInserir />} />
            <Route path="/login" element={<MainLogin />} />
            <Route path="/cadastro" element={<MainCadastrar />} />
            <Route path="/perfil" element={<MainPerfil />} />
            <Route path="/" element={<Navigate to="/buscar" />} />
            <Route path="/projeto-fullstack" element={<Navigate to="/buscar" />} />
          </Routes>
          <Footer />
        </DataProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;