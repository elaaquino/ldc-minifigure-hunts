import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { useEffect } from 'react';
import './HuntPage.css';

const mockHunts = {
  astronauts: ['Red','Pink', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Brown', 'White', 'Gray', 'Black'],
  easter: ['Farmer', 'Buck Teeth', 'Chocolate', 'Pirate', 'Striped', 'Goggles', 'Sunglasses', 'Heart', 'Pink Tie'],
  dreamzzz: ['Cooper', 'Mrs Castillo', 'Mateo', 'Izzie', 'Zoey', 'Mr Oz'],
  transportation: ['Rocketship', 'Cowboy', 'Racecar', 'Boat', 'Airplane', 'Train'],
};

const getReferenceImage = (name) => {
  const fileName = name.toLowerCase().replace(/\s+/g, '') + '.png'; // e.g. "Red" → "red.png"
  return `/minifigs/${fileName}`;
};

function HuntPage() {
  const { huntId } = useParams();
  const storageKey = `found-${huntId}`;
  const navigate = useNavigate();
  const minifigs = mockHunts[huntId] || [];
  const [found, setFound] = useState(() => {
    const stored = sessionStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  });
  const [showPopup, setShowPopup] = useState(false);
  

  useEffect(() => {
    console.log("checking hunt");
    if (minifigs.length > 0 && Object.keys(found).length === minifigs.length) {
      console.log("hunt finished, running popup");
      setShowPopup(true); // you'll define this popup state below
    }
  }, [found, minifigs]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(found));
  }, [found]);

  const handleUpload = (name, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFound((prev) => ({ ...prev, [name]: url }));
    }
  };

  return (
    <div className="hunt-container">
      <div className="hunt-header-container">
      <p className="hunt-subtitle">LEGOLAND Discovery Center Bay Area</p>
      <h1 className="hunt-title">{huntId.charAt(0).toUpperCase() + huntId.slice(1)} Hunt</h1>

      <div className="hunt-header-buttons">
        <div className="found-counter">
          {Object.keys(found).length}/{minifigs.length} Found!
        </div>
        <button className="back-button" onClick={() => navigate('/select')}>
          ← Back
        </button>
      </div>
    </div>
        
    <div className="minifig-list">
    {minifigs.map((name) => {
      const imageUrl = getReferenceImage(name);
      const uploadedUrl = found[name];

      return (
        <div key={name} className="minifig-row">
          {/* Left: Reference Minifig */}
          <div className="minifig-column">
            <p className="minifig-name">{name}</p>
            <img className="minifig-img" src={imageUrl} alt={name} />
          </div>

          {/* Right: Upload Section */}
          <div className="upload-column">
            {uploadedUrl ? (
            <div className="upload-complete">
              <img src={uploadedUrl} alt={`Uploaded for ${name}`} className="upload-img" />
              <label className="retake-button">
                Retake
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(name, e)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div className="upload-placeholder">
              <p className="upload-title">Found {name}?</p>
              <label className="camera-button">
                <img src="/camera.png" alt="Take a picture" className="camera-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(name, e)}
                  style={{ display: 'none' }}
                />
              </label>
              <p>Press here and take a picture!</p>
            </div>
          )}
          </div>
        </div>
      );
    })}
  </div>
    {showPopup && (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>🎉 Congratulations!</h2>
        <p>You found all the minifigures in the {huntId} hunt! Please check in with an employee. :D</p>
        <button onClick={() => setShowPopup(false)}>Close</button>
      </div>
    </div>
  )}
  </div>
  );
}

export default HuntPage;