import React, { useState } from 'react';
import { X, FolderPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.post('http://localhost:8000/api/accounts/categories/', {
        name: name.trim(),
        description: description.trim()
      }, config);

      setSuccess('Category created successfully!');
      setTimeout(() => {
        setName('');
        setDescription('');
        setSuccess('');
        if (onCategoryAdded) onCategoryAdded(response.data);
        onClose();
      }, 800);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.name?.[0] || err.response.data.detail || 'Error creating category.';
        setError(errorMsg);
      } else {
        setError('Cannot connect to backend API.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-card light-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge green">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3>Add New Category</h3>
              <p>Create staff classification (e.g. Sales Manager)</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="modal-alert error">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="modal-alert success">
            <CheckCircle2 size={16} /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Sales Manager, Grid Analyst"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea 
              className="input-field textarea" 
              placeholder="Brief description of responsibilities..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 480px;
          padding: 24px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-icon-badge.green { background: #dcfce7; color: #10b981; }

        .modal-title-wrap h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-title-wrap p {
          font-size: 0.78rem;
          color: #64748b;
        }

        .modal-close-btn {
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin-bottom: 16px;
        }

        .modal-alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .modal-alert.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
        }

        .textarea {
          resize: vertical;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddCategoryModal;
