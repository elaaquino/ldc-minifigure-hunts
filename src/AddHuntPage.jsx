import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './AddHuntPage.css';

function AddHuntPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(1);

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  // -----------------------------------------
  // CREATE URL-FRIENDLY SLUG
  // -----------------------------------------

  const createSlug = (huntName) => {
    return huntName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // -----------------------------------------
  // CREATE HUNT
  // -----------------------------------------

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage('Please enter a hunt name.');
      return;
    }

    setCreating(true);
    setMessage('');

    const slug = createSlug(name);

    if (!slug) {
      setMessage('Please enter a valid hunt name.');
      setCreating(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    console.log(
    'CURRENT USER:',
    sessionData.session?.user?.email
    );

    console.log(
    'ACCESS TOKEN EXISTS:',
    !!sessionData.session?.access_token
    );

    const { error } = await supabase
    .from('hunts')
    .insert({
    name: name.trim(),
    slug: slug,
    is_secret: isSecret,
    hunt_status: status,
    display_order: Number(displayOrder)
    })

    if (error) {
        console.error('SUPABASE ERROR CODE:', error.code);
        console.error('SUPABASE ERROR MESSAGE:', error.message);
        console.error('SUPABASE ERROR DETAILS:', error.details);
        console.error('SUPABASE ERROR HINT:', error.hint);

        setMessage(`Unable to create hunt: ${error.message}`);

        setCreating(false);
        return;
    }

    // Send the manager directly to the existing editor.
    navigate('/admin');
  };

  return (
    <div className="add-hunt-page">

      <header className="add-hunt-header">

        <div>
          <h1>Create New Hunt</h1>

          <p>
            Create the hunt first, then add its
            minifigures and images.
          </p>
        </div>

        <button
          type="button"
          className="back-admin-button"
          onClick={() => navigate('/admin')}
        >
          ← Back to Dashboard
        </button>

      </header>

      <main className="add-hunt-content">

        <form
          className="add-hunt-form"
          onSubmit={handleCreate}
        >

          <section className="add-hunt-section">

            <h2>Hunt Settings</h2>

            <div className="add-hunt-field">

              <label htmlFor="new-hunt-name">
                Hunt Name
              </label>

              <input
                id="new-hunt-name"
                type="text"
                placeholder="Example: Halloween Hunt"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

              {name.trim() && (
                <span className="slug-preview">
                  URL: /hunt/{createSlug(name)}
                </span>
              )}

            </div>

            <div className="add-hunt-row">

              <div className="add-hunt-field">

                <label htmlFor="new-hunt-status">
                  Status
                </label>

                <select
                  id="new-hunt-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="archived">
                    Stored
                  </option>
                </select>

              </div>

              <div className="add-hunt-field">

                <label htmlFor="new-display-order">
                  Display Order
                </label>

                <input
                  id="new-display-order"
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(event) =>
                    setDisplayOrder(event.target.value)
                  }
                />

              </div>

            </div>

            <div className="new-secret-setting">

              <input
                id="new-secret-hunt"
                type="checkbox"
                checked={isSecret}
                onChange={(event) =>
                  setIsSecret(event.target.checked)
                }
              />

              <label htmlFor="new-secret-hunt">
                Secret Hunt
              </label>

            </div>

            {message && (
              <div className="add-hunt-message">
                {message}
              </div>
            )}

            <div className="create-hunt-actions">

              <button
                type="button"
                className="cancel-hunt-button"
                onClick={() => navigate('/admin')}
                disabled={creating}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-hunt-button"
                disabled={creating}
              >
                {creating
                  ? 'Creating...'
                  : 'Create Hunt'}
              </button>

            </div>

          </section>

        </form>

      </main>

    </div>
  );
}

export default AddHuntPage;