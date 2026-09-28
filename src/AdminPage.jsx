import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
  const [session, setSession] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  // Check whether a manager is already logged in
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      setSession(session);
    }

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load hunts once logged in
  useEffect(() => {
    if (session) {
      loadHunts();
    }
  }, [session]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginMessage('Signing in...');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      setLoginMessage('Incorrect email or password.');
      return;
    }

    setLoginMessage('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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

  const updateHuntStatus = async (huntId, newStatus) => {
    const { error } = await supabase
      .from('hunts')
      .update({
        hunt_status: newStatus
      })
      .eq('id', huntId);

    if (error) {
      console.error('Error updating hunt:', error);
      setMessage('Unable to update hunt.');
      return;
    }

    setMessage(`Hunt moved to ${newStatus}.`);

    loadHunts();
  };

  // LOGIN PAGE
  if (!session) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <h1>Scavenger Hunt Manager</h1>

          <p className="login-subtitle">
            Manager Access
          </p>

          <form onSubmit={handleLogin}>
            <label className="email-label">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label className="password-label">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            <button
              className="login-button"
              type="submit"
            >
              Login
            </button>
          </form>

          {loginMessage && (
            <p className="login-message">
              {loginMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p>Loading manager dashboard...</p>
      </div>
    );
  }

  const activeHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'active'
  );

  const draftHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'draft'
  );

  const archivedHunts = hunts.filter(
    (hunt) => hunt.hunt_status === 'archived'
  );

  return (
    <div className="admin-page">

      <header className="admin-header">
        <div>
          <h1>Scavenger Hunt Manager</h1>

          <p>
            Manage guest scavenger hunts
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </header>

      <main className="admin-content">

        <div className="admin-toolbar">
          <button
            className="new-hunt-button"
            onClick={() => navigate('/admin/hunts/new')}
          >
            + New Hunt
          </button>
        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <section className="hunt-section">

          <div className="section-heading">
            <h2>Current Hunts</h2>

            <span>
              {activeHunts.length}
            </span>
          </div>

          <div className="hunt-grid">

            {activeHunts.length === 0 ? (
              <p>No active hunts.</p>
            ) : (
              activeHunts.map((hunt) => (

                <div
                  key={hunt.id}
                  className="admin-hunt-card"
                >
                  <div>
                    <h3>{hunt.name}</h3>

                    <p>
                      {hunt.is_secret
                        ? 'Secret Hunt'
                        : 'Regular Hunt'}
                    </p>
                  </div>

                  <div className="hunt-actions">

                    <button
                      className="edit-button"
                      onClick={() => navigate(`/admin/edit/${hunt.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        updateHuntStatus(
                          hunt.id,
                          'draft'
                        )
                      }
                    >
                      Draft
                    </button>

                    <button
                      className="archive-button"
                      onClick={() =>
                        updateHuntStatus(
                          hunt.id,
                          'archived'
                        )
                      }
                    >
                      Store
                    </button>

                  </div>
                </div>

              ))
            )}

          </div>
        </section>

        <section className="hunt-section">

          <div className="section-heading">
            <h2>Draft Hunts</h2>

            <span>
              {draftHunts.length}
            </span>
          </div>

          <div className="hunt-grid">

            {draftHunts.length === 0 ? (
              <p>No draft hunts.</p>
            ) : (
              draftHunts.map((hunt) => (

                <div
                  key={hunt.id}
                  className="admin-hunt-card"
                >
                  <div>
                    <h3>{hunt.name}</h3>

                    <p>
                      Not visible to guests
                    </p>
                  </div>

                  <div className="hunt-actions">

                    <button
                      className="edit-button"
                      onClick={() => navigate(`/admin/edit/${hunt.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="publish-button"
                      onClick={() =>
                        updateHuntStatus(
                          hunt.id,
                          'active'
                        )
                      }
                    >
                      Publish
                    </button>

                    <button
                      className="archive-button"
                      onClick={() =>
                        updateHuntStatus(
                          hunt.id,
                          'archived'
                        )
                      }
                    >
                      Store
                    </button>

                  </div>
                </div>

              ))
            )}

          </div>
        </section>

        <section className="hunt-section">

          <div className="section-heading">
            <h2>Stored Hunts</h2>

            <span>
              {archivedHunts.length}
            </span>
          </div>

          <div className="hunt-grid">

            {archivedHunts.length === 0 ? (
              <p>No stored hunts.</p>
            ) : (
              archivedHunts.map((hunt) => (

                <div
                  key={hunt.id}
                  className="admin-hunt-card"
                >
                  <div>
                    <h3>{hunt.name}</h3>

                    <p>
                      Saved for future use
                    </p>
                  </div>

                  <div className="hunt-actions">

                    <button
                      className="edit-button"
                    >
                      Edit
                    </button>

                    <button
                      className="publish-button"
                      onClick={() =>
                        updateHuntStatus(
                          hunt.id,
                          'active'
                        )
                      }
                    >
                      Restore
                    </button>

                  </div>
                </div>

              ))
            )}

          </div>
        </section>

      </main>

    </div>
  );
}

export default AdminPage;