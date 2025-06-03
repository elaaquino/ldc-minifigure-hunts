import { useParams } from 'react-router-dom';
import { useState } from 'react';

const mockHunts = {
  astronauts: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'],
  food: ['Burger', 'Pizza', 'Ice Cream'],
  movie: ['Unikitty', 'WildStyle', 'Emmet', 'PresidentBusiness', 'EvilBot'],
  'exclusive-summer': ['Sun', 'Beachball', 'Ice Cream Cone'],
};

function HuntPage() {
  const { huntId } = useParams();
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '480px', // max width for phones/tablets
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <h2>Hunt: {huntId}</h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid black',
                padding: '8px',
                fontWeight: 'bold',
              }}
            >
              Minifigure
            </th>
            <th
              style={{
                borderBottom: '1px solid black',
                padding: '8px',
                fontWeight: 'bold',
              }}
            >
              Photo
            </th>
            <th
              style={{
                borderBottom: '1px solid black',
                padding: '8px',
                fontWeight: 'bold',
              }}
            >
              Upload
            </th>
          </tr>
        </thead>
        <tbody>
          {minifigs.map((name) => (
            <tr key={name} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: '600' }}>{name}</td>
              <td style={{ padding: '8px' }}>
                {found[name] ? (
                  <img
                    src={found[name]}
                    alt={name}
                    width="80"
                    style={{ borderRadius: '6px', objectFit: 'cover' }}
                  />
                ) : (
                  <em>No photo</em>
                )}
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(name, e)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HuntPage;