import { useNavigate } from 'react-router-dom';

function SelectHuntPage() {
  const navigate = useNavigate();

  const hunts = [
    { id: 'astronauts', name: 'Rainbow Astronauts' },
    { id: 'easter', name: 'Easter Hunt' },
    { id: 'dreamz', name: 'Dreamzzz Character Hunt' },
    { id: 'onthego', name: 'On the go!' },
  ];

  return (
    <div className="select-name">
      <h2>Select a hunt</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {hunts.map((hunt) => (
          <li key={hunt.id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => navigate(`/hunt/${hunt.id}`)}
              style={{
                cursor: 'pointer',
                padding: '10px 15px',
                fontSize: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                background: '#f0f0f0',
              }}
            >
              {hunt.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectHuntPage;