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
  );
}

export default HuntPage;