import { Routes, Route, useNavigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import HuntPage from './HuntPage';
import SelectHuntPage from './SelectHuntPage'; //
import React from 'react';
import './App.css';
import AdminPage from './AdminPage';
import EditHuntPage from './EditHuntPage';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className ="cover">
      <h4>LEGOLAND Discovery Center Bay Area</h4>
      <h1>Minifigure Scavenger Hunt</h1>
      <p className="subtitle">Walk through Miniland and <br ></br>search for lost minifigures!</p>
      <p className="subtitle">Each completed hunt will <br ></br> earn you a prize!</p>
      <button className="start-button" onClick={() => navigate('/select')}>Start!</button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select" element={<SelectHuntPage />} />
      <Route path="/hunt/:huntId" element={<HuntPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/edit/:huntId" element={<EditHuntPage />} />
    </Routes>
  );
}

export default App;