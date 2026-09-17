import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function AdminPage() {
  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadHunts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('hunts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading hunts:', error);
      setMessage('Unable to load hunts.');
    } else {
      setHunts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadHunts();
  }, []);

  const updateHuntStatus = async (huntId, newStatus) => {
    const { error } = await supabase
      .from('hunts')
      .update({ hunt_status: newStatus })
      .eq('id', huntId);

    if (error) {
      console.error('Error updating hunt:', error);
      setMessage('Unable to update hunt.');
      return;
    }

    setMessage(`Hunt moved to ${newStatus}.`);
    loadHunts();
  };

  const activeHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'active'
  );

  const draftHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'draft'
  );

  const archivedHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'archived'
  );

  if (loading) {
    return <p>Loading manager dashboard...</p>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Scavenger Hunt Manager</h1>

      <button
        onClick={() => {
          setMessage('New Hunt form coming next!');
        }}
      >
        + New Hunt
      </button>

      {message && (
        <p style={{ marginTop: '15px' }}>
          {message}
        </p>
      )}

      <hr />

      <h2>Active Hunts</h2>

      {activeHunts.length === 0 ? (
        <p>No active hunts.</p>
      ) : (
        activeHunts.map((hunt) => (
          <div
            key={hunt.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <h3>{hunt.name}</h3>

            <p>
              Secret: {hunt.is_secret ? 'Yes' : 'No'}
            </p>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'draft')
              }
            >
              Move to Draft
            </button>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'archived')
              }
              style={{ marginLeft: '10px' }}
            >
              Archive
            </button>
          </div>
        ))
      )}

      <hr />

      <h2>Draft Hunts</h2>

      {draftHunts.length === 0 ? (
        <p>No draft hunts.</p>
      ) : (
        draftHunts.map((hunt) => (
          <div
            key={hunt.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <h3>{hunt.name}</h3>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'active')
              }
            >
              Publish
            </button>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'archived')
              }
              style={{ marginLeft: '10px' }}
            >
              Archive
            </button>
          </div>
        ))
      )}

      <hr />

      <h2>Stored Hunts</h2>

      {archivedHunts.length === 0 ? (
        <p>No stored hunts.</p>
      ) : (
        archivedHunts.map((hunt) => (
          <div
            key={hunt.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <h3>{hunt.name}</h3>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'active')
              }
            >
              Restore
            </button>

            <button
              onClick={() =>
                updateHuntStatus(hunt.id, 'draft')
              }
              style={{ marginLeft: '10px' }}
            >
              Move to Draft
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPage;