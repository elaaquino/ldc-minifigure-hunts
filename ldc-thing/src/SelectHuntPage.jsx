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
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Select a Hunt</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {hunts.map((hunt) => (
          <li key={hunt.id} style={{ marginBottom: '12px' }}>
            <button
              onClick={() => navigate(`/hunt/${hunt.id}`)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#5c5858',
                cursor: 'pointer',
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