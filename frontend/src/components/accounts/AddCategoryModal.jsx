import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FolderPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/apiConfig';

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

      const response = await axios.post(`${API_BASE_URL}/api/accounts/categories/`, {
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

  return createPortal(
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card animate-modal-pop">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge green">
              <FolderPlus size={22} />
            </div>
            <div>
              <h3>Add New Category</h3>
              <p>Create staff classification (e.g. Sales Manager)</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close Modal">
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
        @keyframes modalOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(15, 23, 42, 0.65) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          padding: 20px;
          margin: 0 !important;
          animation: modalOverlayFade 0.2s ease-out forwards;
        }

        .modal-card {
          width: 100%;
          max-width: 500px;
          padding: 28px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05);
          animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-icon-badge {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
        }

        .modal-icon-badge.green { 
          background: rgba(16, 185, 129, 0.12); 
          color: #10b981; 
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .modal-title-wrap h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .modal-title-wrap p {
          font-size: 0.82rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .modal-close-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .modal-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 18px;
        }

        .modal-alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .modal-alert.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
        }

        .input-field {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #0f172a;
          font-size: 0.88rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-field.textarea {
          height: auto;
          padding: 12px 14px;
          resize: vertical;
          font-family: inherit;
        }

        .input-field:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3.5px rgba(16, 185, 129, 0.15);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 4px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: #ffffff;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.88rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default AddCategoryModal;
