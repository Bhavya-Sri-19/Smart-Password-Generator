//import logo from './logo.svg';
import React from 'react';
import PasswordGenerator from './components/PasswordGenerator';

import './App.css';

function App() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔐 Password Generator</h2>
      <PasswordGenerator />
    </div>
  );
}

export default App;
