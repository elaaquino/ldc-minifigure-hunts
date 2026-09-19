import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './EditHuntPage.css';

function EditHuntPage() {
  const { huntId } = useParams();
  const navigate = useNavigate();

  // -----------------------------------------
  // HUNT SETTINGS
  // -----------------------------------------

  const [name, setName] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(1);

  // -----------------------------------------
  // HUNT ITEMS
  // -----------------------------------------

  const [items, setItems] = useState([]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);

  // -----------------------------------------
  // PAGE STATES
  // -----------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

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
  // GET IMAGE URL
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
  // ADD NEW ITEM + UPLOAD IMAGE
  // -----------------------------------------

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      setMessage('Please enter a minifigure name.');
      return;
    }

    if (!newItemImage) {
      setMessage('Please select a reference image.');
      return;
    }

    setAddingItem(true);
    setMessage('');

    let uploadedImagePath = null;

    try {
      // Get file extension
      const fileExtension =
        newItemImage.name.split('.').pop().toLowerCase();

      // Create a safe version of the minifigure name
      const safeName = newItemName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Create unique filename
      const fileName =
        `${Date.now()}-${safeName}.${fileExtension}`;

      // Each hunt gets its own folder
      const imagePath = `${huntId}/${fileName}`;

      uploadedImagePath = imagePath;

      // -------------------------------------
      // UPLOAD TO SUPABASE STORAGE
      // -------------------------------------

      const { error: uploadError } =
        await supabase.storage
          .from('hunt-images')
          .upload(imagePath, newItemImage, {
            cacheControl: '3600',
            upsert: false
          });

      if (uploadError) {
        throw uploadError;
      }

      // -------------------------------------
      // DETERMINE DISPLAY ORDER
      // -------------------------------------

      const nextDisplayOrder =
        items.length > 0
          ? Math.max(
              ...items.map(
                (item) => item.display_order || 0
              )
            ) + 1
          : 1;

      // -------------------------------------
      // CREATE DATABASE ROW
      // -------------------------------------

      const { error: insertError } =
        await supabase
          .from('hunt_items')
          .insert({
            hunt_id: Number(huntId),
            name: newItemName.trim(),
            image_path: imagePath,
            display_order: nextDisplayOrder
          });

      if (insertError) {
        // Database failed, so remove the image
        // we just uploaded.
        await supabase.storage
          .from('hunt-images')
          .remove([imagePath]);

        throw insertError;
      }

      // -------------------------------------
      // SUCCESS
      // -------------------------------------

      setNewItemName('');
      setNewItemImage(null);

      // Reset the file input itself
      const fileInput =
        document.getElementById('new-item-image');

      if (fileInput) {
        fileInput.value = '';
      }

      setMessage('Item added successfully!');

      await loadItems();

    } catch (error) {
      console.error('Error adding item:', error);

      setMessage(
        'Unable to add item. Check the console for details.'
      );

      // Attempt cleanup if something failed
      // after the image uploaded.
      if (uploadedImagePath) {
        console.log(
          'Uploaded image path:',
          uploadedImagePath
        );
      }

    } finally {
      setAddingItem(false);
    }
  };

  // -----------------------------------------
  // DELETE ITEM + STORAGE IMAGE
  // -----------------------------------------

  const handleDeleteItem = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage('');

    // Delete database row first
    const { error: deleteError } = await supabase
      .from('hunt_items')
      .delete()
      .eq('id', item.id);

    if (deleteError) {
      console.error(
        'Error deleting hunt item:',
        deleteError
      );

      setMessage('Unable to delete item.');
      return;
    }

    // If the item has an image, remove it
    // from Supabase Storage too.
    if (item.image_path) {
      const { error: storageError } =
        await supabase.storage
          .from('hunt-images')
          .remove([item.image_path]);

      if (storageError) {
        console.error(
          'Item deleted, but image could not be removed:',
          storageError
        );
      }
    }

    setMessage('Item deleted.');

    await loadItems();
  };

  // -----------------------------------------
  // IMAGE PREVIEW
  // -----------------------------------------

  const newImagePreview = newItemImage
    ? URL.createObjectURL(newItemImage)
    : null;

  // -----------------------------------------
  // LOADING
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

      {/* HEADER */}

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

        {/* -------------------------------- */}
        {/* HUNT SETTINGS                    */}
        {/* -------------------------------- */}

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
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </section>

        </form>

        {/* -------------------------------- */}
        {/* MESSAGE                          */}
        {/* -------------------------------- */}

        {message && (
          <div className="edit-message">
            {message}
          </div>
        )}

        {/* -------------------------------- */}
        {/* HUNT ITEMS                       */}
        {/* -------------------------------- */}

        <section className="hunt-items-section">

          <div className="items-header">

            <div>
              <h2>Hunt Items</h2>

              <p>
                Manage the minifigures guests need to
                find.
              </p>
            </div>

            <span className="item-count">
              {items.length}{' '}
              {items.length === 1
                ? 'Item'
                : 'Items'}
            </span>

          </div>

          {/* EXISTING ITEMS */}

          <div className="admin-items-list">

            {items.length === 0 ? (

              <div className="empty-items">
                No items have been added to this hunt
                yet.
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

                    {/* IMAGE */}

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

                    {/* INFO */}

                    <div className="admin-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Display Order:{' '}
                        {item.display_order}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-item-actions">

                      <button
                        type="button"
                        className="delete-item-button"
                        onClick={() =>
                          handleDeleteItem(item)
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

          {/* -------------------------------- */}
          {/* ADD NEW ITEM                     */}
          {/* -------------------------------- */}

          <div className="add-item-section">

            <div className="add-item-heading">

              <h3>Add New Item</h3>

              <p>
                Add a minifigure and its reference
                image to this scavenger hunt.
              </p>

            </div>

            <div className="add-item-form">

              {/* NAME */}

              <div className="add-item-field">

                <label htmlFor="new-item-name">
                  Minifigure Name
                </label>

                <input
                  id="new-item-name"
                  type="text"
                  placeholder="Example: Green Astronaut"
                  value={newItemName}
                  onChange={(event) =>
                    setNewItemName(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* IMAGE */}

              <div className="add-item-field">

                <label htmlFor="new-item-image">
                  Reference Image
                </label>

                <input
                  id="new-item-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    setNewItemImage(
                      event.target.files?.[0] ||
                        null
                    )
                  }
                />

                <span className="image-help-text">
                  PNG, JPG, JPEG, or WEBP
                </span>

              </div>

              {/* IMAGE PREVIEW */}

              {newImagePreview && (

                <div className="new-image-preview">

                  <p>Image Preview</p>

                  <div className="preview-image-box">

                    <img
                      src={newImagePreview}
                      alt="New minifigure preview"
                    />

                  </div>

                </div>

              )}

              {/* ADD BUTTON */}

              <button
                type="button"
                className="add-item-button"
                onClick={handleAddItem}
                disabled={addingItem}
              >

                {addingItem
                  ? 'Uploading & Adding...'
                  : '+ Add Item'}

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default EditHuntPage;