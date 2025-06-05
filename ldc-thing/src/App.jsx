import { Routes, Route, useNavigate } from 'react-router-dom';
import HuntPage from './HuntPage';
import SelectHuntPage from './SelectHuntPage'; // ✅ import the actual file

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>LEGO Scavenger Hunt</h1>
      <p>Select your hunt and start finding minifigures!</p>
      <button onClick={() => navigate('/select')}>Start!</button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select" element={<SelectHuntPage />} /> {/* ✅ now it uses the real one */}
      <Route path="/hunt/:huntId" element={<HuntPage />} />
    </Routes>
  );
}

export default App;