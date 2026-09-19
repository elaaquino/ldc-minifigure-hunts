import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './EditHuntPage.css';

function EditHuntPage() {
  const { huntId } = useParams();
  const navigate = useNavigate();

  // Hunt settings
  const [name, setName] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(1);

  // Hunt items
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  // Page states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // -----------------------------------------
  // LOAD HUNT
  // -----------------------------------------

  useEffect(() => {
    async function loadHunt() {
      const { data, error } = await supabase
        .from('hunts')
        .select('*')
        .eq('id', huntId)
        .single();

      if (error) {
        console.error('Error loading hunt:', error);
        setMessage('Unable to load hunt.');
        setLoading(false);
        return;
      }

      setName(data.name || '');
      setIsSecret(data.is_secret || false);
      setStatus(data.hunt_status || 'draft');
      setDisplayOrder(data.display_order || 1);

      setLoading(false);
    }

    loadHunt();
  }, [huntId]);

  // -----------------------------------------
  // LOAD HUNT ITEMS
  // -----------------------------------------

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('hunt_items')
      .select('*')
      .eq('hunt_id', huntId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading hunt items:', error);
      setMessage('Unable to load hunt items.');
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    loadItems();
  }, [huntId]);

  // -----------------------------------------
  // SAVE HUNT SETTINGS
  // -----------------------------------------

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('hunts')
      .update({
        name: name.trim(),
        is_secret: isSecret,
        hunt_status: status,
        display_order: Number(displayOrder)
      })
      .eq('id', huntId);

    if (error) {
      console.error('Error saving hunt:', error);
      setMessage('Unable to save changes.');
      setSaving(false);
      return;
    }

    setMessage('Changes saved!');
    setSaving(false);
  };

  // -----------------------------------------
  // ADD HUNT ITEM
  // -----------------------------------------

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      setMessage('Please enter an item name.');
      return;
    }

    const nextDisplayOrder =
      items.length > 0
        ? Math.max(
            ...items.map((item) => item.display_order || 0)
          ) + 1
        : 1;

    const { error } = await supabase
      .from('hunt_items')
      .insert({
        hunt_id: Number(huntId),
        name: newItemName.trim(),
        display_order: nextDisplayOrder
      });

    if (error) {
      console.error('Error adding item:', error);
      setMessage('Unable to add item.');
      return;
    }

    setNewItemName('');
    setMessage('Item added!');

    await loadItems();
  };

  // -----------------------------------------
  // DELETE HUNT ITEM
  // -----------------------------------------

  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('hunt_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      setMessage('Unable to delete item.');
      return;
    }

    setMessage('Item deleted.');

    await loadItems();
  };

  // -----------------------------------------
  // GET SUPABASE IMAGE URL
  // -----------------------------------------

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    const { data } = supabase.storage
      .from('hunt-images')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  // -----------------------------------------
  // LOADING SCREEN
  // -----------------------------------------

  if (loading) {
    return (
      <div className="edit-hunt-page">
        <p>Loading hunt...</p>
      </div>
    );
  }

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <div className="edit-hunt-page">

      {/* Header */}

      <header className="edit-hunt-header">
        <div>
          <h1>Edit Hunt</h1>

          <p>
            Manage scavenger hunt settings and content.
          </p>
        </div>

        <button
          className="back-admin-button"
          onClick={() => navigate('/admin')}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="edit-hunt-content">

        {/* Hunt Settings */}

        <form
          className="edit-hunt-form"
          onSubmit={handleSave}
        >
          <section className="form-section">

            <h2>Hunt Settings</h2>

            <div className="form-group">
              <label htmlFor="hunt-name">
                Hunt Name
              </label>

              <input
                id="hunt-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="hunt-status">
                  Status
                </label>

                <select
                  id="hunt-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                  <option value="archived">
                    Stored
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="display-order">
                  Display Order
                </label>

                <input
                  id="display-order"
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(event) =>
                    setDisplayOrder(event.target.value)
                  }
                />
              </div>

            </div>

            <div className="secret-setting">
              <input
                id="secret-hunt"
                type="checkbox"
                checked={isSecret}
                onChange={(event) =>
                  setIsSecret(event.target.checked)
                }
              />

              <label htmlFor="secret-hunt">
                Secret Hunt
              </label>
            </div>

            <button
              className="save-hunt-button"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </section>
        </form>

        {/* Status Message */}

        {message && (
          <div className="edit-message">
            {message}
          </div>
        )}

        {/* Hunt Items */}

        <section className="hunt-items-section">

          <div className="items-header">
            <div>
              <h2>Hunt Items</h2>

              <p>
                Manage the minifigures guests need to find.
              </p>
            </div>

            <span className="item-count">
              {items.length} Items
            </span>
          </div>

          <div className="admin-items-list">

            {items.length === 0 ? (
              <div className="empty-items">
                No items have been added to this hunt yet.
              </div>
            ) : (
              items.map((item) => {
                const imageUrl =
                  getImageUrl(item.image_path);

                return (
                  <div
                    className="admin-item-card"
                    key={item.id}
                  >

                    <div className="admin-item-image">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <div className="no-item-image">
                          No Image
                        </div>
                      )}

                    </div>

                    <div className="admin-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Display Order:{' '}
                        {item.display_order}
                      </p>

                    </div>

                    <div className="admin-item-actions">

                      <button
                        type="button"
                        className="delete-item-button"
                        onClick={() =>
                          handleDeleteItem(item.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* Add Item */}

          <div className="add-item-section">

            <h3>Add New Item</h3>

            <p>
              Add another minifigure to this scavenger hunt.
            </p>

            <div className="add-item-controls">

              <input
                type="text"
                placeholder="Minifigure name"
                value={newItemName}
                onChange={(event) =>
                  setNewItemName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddItem();
                  }
                }}
              />

              <button
                type="button"
                onClick={handleAddItem}
              >
                + Add Item
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default EditHuntPage;