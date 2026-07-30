import React, { useState, useEffect } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AddStaffModal = ({ isOpen, onClose, onStaffAdded, categories }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Staff');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('Active');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.post('http://localhost:8000/api/accounts/staff/', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim() || 'Staff',
        category: categoryId ? parseInt(categoryId) : null,
        status: status
      }, config);

      setSuccess('Staff member added successfully!');
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setRole('Staff');
        setSuccess('');
        if (onStaffAdded) onStaffAdded(response.data);
        onClose();
      }, 800);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMsg = errorData.email?.[0] || errorData.name?.[0] || errorData.detail || 'Error creating staff member.';
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
            <div className="modal-icon-badge purple">
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Add New Staff Member</h3>
              <p>Create staff record and assign category</p>
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
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="rahul@meda.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Job Role / Designation</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Senior Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Category / Department *</label>
              <select 
                className="input-field select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Account Status</label>
              <select 
                className="input-field select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Create Staff Member'}
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
          max-width: 560px;
          padding: 26px;
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

        .modal-icon-badge.purple { background: #f3e8ff; color: #8b5cf6; }

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

        .form-row {
          display: flex;
          gap: 14px;
        }

        @media (max-width: 500px) {
          .form-row { flex-direction: column; }
        }

        .flex-1 { flex: 1; }

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

        .select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
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

export default AddStaffModal;
