import { useNavigate } from 'react-router-dom';
import './SelectHuntPage.css';
import React, { useState, useEffect } from 'react';

function SelectHuntPage() {
  const navigate = useNavigate();

  // Check sessionStorage for unlock status on load
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem('bonusUnlocked') === 'true';
  });

  const [secretCode, setSecretCode] = useState(unlocked ? 'Unlocked!' : '');
  const [message, setMessage] = useState(unlocked ? 'Bonus hunts unlocked!' : '');

  const baseHunts = [
    { id: 'astronauts', name: 'Rainbow Astronauts' },
    { id: 'easter', name: 'Easter Hunt' },
    { id: 'wild', name: 'A Wild Scavenger Hunt' },
    { id: 'transportation', name: 'On the go!' },
  ];

  const bonusHunts = [
    { id: 'dreamzzz', name: 'DreamZZZ Characters' },
    { id: 'crystal', name: 'Crystal Treasure Hunt' },
  ];

  const allHunts = unlocked ? [...baseHunts, ...bonusHunts] : baseHunts;

  const handleCodeSubmit = () => {
    if (secretCode.trim().toLowerCase() === 'millie') {
      setUnlocked(true);
      sessionStorage.setItem('bonusUnlocked', 'true');
      setSecretCode('Unlocked!');
      setMessage('Bonus hunts unlocked!');
    } else {
      setMessage('Incorrect code. Try again!');
    }
  };

  return (
    <div className="hunt-page">
      <h2 className="choose-hunt">Choose your hunt!</h2>
      <ul className="hunt-list">
        {allHunts.map((hunt) => (
          <li key={hunt.id} className="button-format">
            <button className="hunt-buttons" onClick={() => navigate(`/hunt/${hunt.id}`)}>
              {hunt.name}
            </button>
          </li>
        ))}
      </ul>
      <p className="hint-text">Ask a Master Model Builder for a hint!</p>
      <p className="hint-text">Enter Secret Code:</p>
      <input
        type="text"
        className="secret"
        value={secretCode}
        onChange={(e) => setSecretCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCodeSubmit();
        }}
        disabled={unlocked}
      />
      <button className="submit" onClick={handleCodeSubmit} disabled={unlocked}>Submit</button>
      {message && <p className="hint-text2">{message}</p>}
      <p className="hint-text2">Attend a creative workshop class for the secret code!</p>
    </div>
  );
}

export default SelectHuntPage;
