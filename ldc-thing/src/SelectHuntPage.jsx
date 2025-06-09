import { useNavigate } from 'react-router-dom';
import './SelectHuntPage.css'

function SelectHuntPage() {
  const navigate = useNavigate();

  const hunts = [
    { id: 'astronauts', name: 'Rainbow Astronauts' },
    { id: 'easter', name: 'Easter Hunt' },
    { id: 'dreamz', name: 'Dreamzzz Character Hunt' },
    { id: 'onthego', name: 'On the go!' },
  ];

  return (
    <div className="hunt-page">
      <h2>Select a Hunt</h2>
      <ul className="hunt-list">
        {hunts.map((hunt) => (
          <li className="button-format">
            <button className="hunt-buttons" onClick={() => navigate(`/hunt/${hunt.id}`)}>
              {hunt.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectHuntPage;