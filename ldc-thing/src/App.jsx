import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <h1>LEGO Scavenger Hunt</h1>
      <p>Select your hunt and start finding minifigures!</p>
      <button onClick={() => navigate('/select')}>Start!</button>
    </div>
  );
}

function SelectHuntPage() {
  return (
    <div className="select-name">
      <h2>Select a hunt</h2>
      <ul>
        <li>Rainbow Astronauts</li>
        <li>Food Minifigures</li>
        <li>LEGO Movie</li>
        <li>EXCLUSIVE Summer Hunt</li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select" element={<SelectHuntPage />} />
    </Routes>
  );
}

export default App;