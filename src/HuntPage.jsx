import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './HuntPage.css';

function HuntPage() {
  const { huntId } = useParams();
  const navigate = useNavigate();

  const storageKey = `found-${huntId}`;

  const [hunt, setHunt] = useState(null);
  const [minifigs, setMinifigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [found, setFound] = useState(() => {
    const stored = sessionStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  });

  const [showPopup, setShowPopup] = useState(false);

  // Converts a stored Supabase path into a public image URL
  const getImageUrl = (path) => {
    if (!path) return null;

    const { data } = supabase.storage
      .from('hunt-images')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  // Load current hunt + hunt items
  useEffect(() => {
    async function loadHunt() {
      setLoading(true);
      setLoadError('');

      const { data: huntData, error: huntError } = await supabase
        .from('hunts')
        .select('id, name, slug, hunt_status')
        .eq('slug', huntId)
        .eq('hunt_status', 'active')
        .single();

      if (huntError) {
        console.error('Error loading hunt:', huntError);
        setLoadError('Unable to load this scavenger hunt.');
        setLoading(false);
        return;
      }

      setHunt(huntData);

      const { data: itemData, error: itemError } = await supabase
        .from('hunt_items')
        .select('*')
        .eq('hunt_id', huntData.id)
        .order('display_order', { ascending: true });

      if (itemError) {
        console.error('Error loading hunt items:', itemError);
        setLoadError('Unable to load scavenger hunt items.');
        setLoading(false);
        return;
      }

      console.log('Loaded hunt:', huntData);
      console.log('Loaded hunt items:', itemData);

      setMinifigs(itemData || []);
      setLoading(false);
    }

    loadHunt();
  }, [huntId]);

  // Save progress in session storage
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(found));
  }, [found, storageKey]);

  // Show completion popup
  useEffect(() => {
    if (
      minifigs.length > 0 &&
      Object.keys(found).length === minifigs.length
    ) {
      setShowPopup(true);
    }
  }, [found, minifigs]);

  const handleUpload = (itemId, event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);

      setFound((prev) => ({
        ...prev,
        [itemId]: url,
      }));
    }
  };

  if (loading) {
    return (
      <div className="hunt-container">
        <p>Loading scavenger hunt...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="hunt-container">
        <p>{loadError}</p>

        <button
          className="back-button"
          onClick={() => navigate('/select')}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="hunt-container">

      <div className="hunt-header-container">
        <p className="hunt-subtitle">
          LEGOLAND Discovery Center Bay Area
        </p>

        <h1 className="hunt-title">
          {hunt?.name} Hunt
        </h1>

        <div className="hunt-header-buttons">
          <div className="found-counter">
            {Object.keys(found).length}/{minifigs.length} Found!
          </div>

          <button
            className="back-button"
            onClick={() => navigate('/select')}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="minifig-list">
        {minifigs.map((item) => {
          const uploadedUrl = found[item.id];
          const referenceImageUrl = getImageUrl(item.image_path);

          console.log('ITEM:', item.name);
          console.log('IMAGE PATH:', item.image_path);
          console.log('IMAGE URL:', referenceImageUrl);

          return (
            <div
              key={item.id}
              className="minifig-row"
            >

              <div className="minifig-column">
                <p className="minifig-name">
                  {item.name}
                </p>

                {referenceImageUrl && (
                  <img
                    className="minifig-img"
                    src={referenceImageUrl}
                    alt={item.name}
                  />
                )}

                {item.description && (
                  <p className="minifig-description">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="upload-column">
                {uploadedUrl ? (
                  <div className="upload-complete">

                    <img
                      src={uploadedUrl}
                      alt={`Uploaded for ${item.name}`}
                      className="upload-img"
                    />

                    <label className="retake-button">
                      Retake

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUpload(item.id, e)
                        }
                        style={{ display: 'none' }}
                      />
                    </label>

                  </div>
                ) : (
                  <div className="upload-placeholder">

                    <p className="upload-title">
                      Found {item.name}?
                    </p>

                    <label className="camera-button">
                      <img
                        src="/camera.png"
                        alt="Take a picture"
                        className="camera-icon"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUpload(item.id, e)
                        }
                        style={{ display: 'none' }}
                      />
                    </label>

                    <p>
                      Press here and take a picture!
                    </p>

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

            <p>
              You found all the minifigures in the {hunt?.name} hunt!
              Please check in with a Master Model Builder at the
              Creative Workshop! :D
            </p>

            <button
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default HuntPage;