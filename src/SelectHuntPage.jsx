import { useNavigate } from 'react-router-dom';
import './SelectHuntPage.css'
import React from 'react';

function SelectHuntPage() {
  const navigate = useNavigate();

  const hunts = [
    { id: 'astronauts', name: 'Rainbow Astronauts' },
    { id: 'easter', name: 'Easter Hunt' },
    { id: 'dreamzzz', name: 'Dreamzzz Character Hunt' },
    { id: 'transportation', name: 'On the go!' },
  ];

  return (
    <div className="hunt-page">
      <h2 className="choose-hunt">Choose your hunt!</h2>
      <ul className="hunt-list">
        {hunts.map((hunt) => (
          <li className="button-format">
            <button className="hunt-buttons" onClick={() => navigate(`/hunt/${hunt.id}`)}>
              {hunt.name}
            </button>
          </li>
        ))}
      </ul>
      <p className="hint-text">Need a hint?</p>
      <p className="hint-text">Ask a Master Model Builder!</p>
      <p className="hint-text2">Hunt data resets once site closes.</p>
    </div>
  );
}

export default SelectHuntPage;