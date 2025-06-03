import { Routes, Route, useNavigate } from 'react-router-dom';
import HuntPage from './HuntPage';  // make sure this path is correct!

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

function SelectHuntPage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px'}}>
      <h1>Select a hunt</h1>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select" element={<SelectHuntPage />} />
      <Route path="/hunt/:huntId" element={<HuntPage />} />  {/* This line */}
    </Routes>
  );
}

export default App;