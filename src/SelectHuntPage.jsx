import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './SelectHuntPage.css';
import React, { useEffect, useState } from 'react';

function SelectHuntPage() {
  const navigate = useNavigate();

  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem('bonusUnlocked') === 'true';
  });

  const [secretCode, setSecretCode] = useState(() => {
    return sessionStorage.getItem('bonusUnlocked') === 'true'
      ? 'Unlocked!'
      : '';
  });

  const [message, setMessage] = useState(() => {
    return sessionStorage.getItem('bonusUnlocked') === 'true'
      ? 'Bonus hunts unlocked!'
      : '';
  });

  useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase
      .from("hunts")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
  }

  testConnection();
}, []);

  useEffect(() => {
    async function loadHunts() {
      const { data, error } = await supabase
        .from('hunts')
        .select('id, name, slug, is_secret, display_order')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading hunts:', error);
        setLoadError('Unable to load scavenger hunts.');
      } else {
        setHunts(data || []);
      }

      setLoading(false);
    }

    loadHunts();
  }, []);

  const displayedHunts = hunts.filter((hunt) => {
    return !hunt.is_secret || unlocked;
  });

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

  if (loading) {
    return (
      <div className="hunt-page">
        <p>Loading scavenger hunts...</p>
      </div>
    );
  }

  return (
    <div className="hunt-page">
      <h2 className="choose-hunt">Choose your hunt!</h2>

      {loadError && <p className="hint-text2">{loadError}</p>}

      <ul className="hunt-list">
        {displayedHunts.map((hunt) => (
          <li key={hunt.id} className="button-format">
            <button
              className="hunt-buttons"
              onClick={() => navigate(`/hunt/${hunt.slug}`)}
            >
              {hunt.name}
            </button>
          </li>
        ))}
      </ul>

      <p className="hint-text">
        Ask a Master Model Builder for a hint!
      </p>

      <p className="hint-text">Enter Secret Code:</p>

      <input
        type="text"
        className="secret"
        value={secretCode}
        onChange={(event) => setSecretCode(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleCodeSubmit();
          }
        }}
        disabled={unlocked}
      />

      <button
        className="submit"
        onClick={handleCodeSubmit}
        disabled={unlocked}
      >
        Submit
      </button>

      {message && <p className="hint-text2">{message}</p>}

      <p className="hint-text2">
        Attend a creative workshop class for the secret code!
      </p>
    </div>
  );
}

export default SelectHuntPage;