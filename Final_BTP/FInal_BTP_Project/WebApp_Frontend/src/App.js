import React from 'react';
import './App.css';
import { useHistory } from 'react-router-dom'

function App() {

  let history = useHistory();

  return (
    <div className="App">
      <h1>Welcome To Voice-Disorder Detection App</h1>
      <h2>IIIT Hyderabad</h2>
      <div>
        <button onClick={() => history.push('/recordvoice')}>Record Voice</button>
      </div>
      <div>
        <button onClick={() => history.push('/uploadvoice')}>Upload Recording</button>
      </div>
    </div>
  );
}

export default App;