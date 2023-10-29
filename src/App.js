import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import { DataProvider } from './DataContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <DataProvider>
        <Main />
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;