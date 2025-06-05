import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './HuntPage.css';

const mockHunts = {
  astronauts: ['Red','Pink', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Brown', 'White', 'Gray', 'Black'],
  easter: ['Trident', 'Dotted', 'Chocolate', 'Pirate', 'Striped', 'Glass', 'Sunglasses', 'Heart', 'Pinktie'],
  dreamz: ['Cooper', 'Mrs Castillo', 'Mateo', 'Izzie', 'Zoey', 'Mr Oz'],
  onthego: ['Rocketship', 'Cowboy', 'Racecar', 'Boat', 'Airplane', 'Train'],
};

const getReferenceImage = (name) => {
  const fileName = name.toLowerCase().replace(/\s+/g, '') + '.png'; // e.g. "Red" → "red.png"
  return `/minifigs/${fileName}`;
};

function HuntPage() {
  const { huntId } = useParams();
  const navigate = useNavigate();
  const minifigs = mockHunts[huntId] || [];
  const [found, setFound] = useState({});

  const handleUpload = (name, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFound((prev) => ({ ...prev, [name]: url }));
    }
  };

  return (
    <div className="hunt-container">
    <div className="hunt-header">
      <h2 className="hunt-title">{huntId.toUpperCase()} Hunt</h2>
      <button className="back-button" onClick={() => navigate('/select')}>← Back</button>
    </div>

    <div className="minifig-grid">
      {minifigs.map((name) => {
        const fileName = name.toLowerCase().replace(/\s+/g, '') + '.png';
        const imageUrl = `/minifigs/${fileName}`;
        const uploadedUrl = found[name];

        return (
          <div key={name} className="minifig-card">
            <img src={imageUrl} alt={name} />
            <p className="minifig-name">{name}</p>

            {uploadedUrl ? (
              <img src={uploadedUrl} alt={`Uploaded for ${name}`} />
            ) : (
              <div className="upload-placeholder">No photo yet</div>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleUpload(name, e)} />
          </div>
        );
      })}
    </div>
  </div>
  );
}

export default HuntPage;