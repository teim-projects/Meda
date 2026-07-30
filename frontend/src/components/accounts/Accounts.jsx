import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FolderPlus, 
  Search, 
  Filter, 
  RefreshCw, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Briefcase,
  Layers,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import AddCategoryModal from './AddCategoryModal';
import AddStaffModal from './AddStaffModal';

const Accounts = () => {
  const [staffList, setStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [catRes, staffRes] = await Promise.all([
        axios.get('http://localhost:8000/api/accounts/categories/', config),
        axios.get('http://localhost:8000/api/accounts/staff/', config)
      ]);

      setCategories(catRes.data);
      setStaffList(staffRes.data);
    } catch (err) {
      console.error('Error fetching accounts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleStaffAdded = (newStaff) => {
    setStaffList((prev) => [newStaff, ...prev]);
    fetchData(); // Refresh counts
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:8000/api/accounts/staff/${id}/`, config);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error deleting staff member.');
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'ALL' || staff.category === parseInt(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="accounts-container animate-fade-in">
      {/* Top Action Header */}
      <div className="accounts-header light-card">
        <div className="ah-title-wrap">
          <div className="ah-icon-badge">
            <Users size={22} />
          </div>
          <div>
            <h2>Staff & Accounts Directory</h2>
            <p>Manage staff members, roles, and organizational categories</p>
          </div>
        </div>

        {/* Top Right Buttons */}
        <div className="ah-actions">
          <button 
            className="btn-outline-green" 
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <FolderPlus size={17} />
            <span>Add Category</span>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => setIsStaffModalOpen(true)}
          >
            <UserPlus size={17} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="categories-summary-bar light-card">
        <div className="cs-title">
          <Layers size={16} /> <span>Categories:</span>
        </div>
        <div className="category-pills">
          <button 
            className={`cat-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Staff ({staffList.length})
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`cat-pill ${selectedCategory === String(cat.id) ? 'active' : ''}`}
              onClick={() => setSelectedCategory(String(cat.id))}
            >
              {cat.name} ({cat.staff_count})
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="table-toolbar light-card">
        <div className="search-filter-box">
          <Search size={18} className="sf-icon" />
          <input 
            type="text" 
            placeholder="Search staff by name, email, designation..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field sf-input"
          />
        </div>

        <div className="toolbar-controls">
          <div className="filter-dropdown-wrap">
            <Filter size={16} className="fd-icon" />
            <select 
              className="select-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button className="btn-icon-light" onClick={fetchData} title="Refresh Staff Data">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="staff-table-card light-card">
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Category</th>
                <th>Designation / Role</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    <RefreshCw size={20} className="spin" /> Loading staff directory...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    No staff members found. Click <strong>"Add Staff Member"</strong> to create one.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="user-cell">
                      <div className="staff-avatar">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="staff-meta">
                        <span className="staff-name">{staff.name}</span>
                        <span className="staff-id">ID: #{staff.id}</span>
                      </div>
                    </td>

                    <td>
                      <span className="category-tag">
                        <Briefcase size={12} /> {staff.category_name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="role-cell">{staff.role}</td>

                    <td className="contact-cell">
                      <div className="contact-line">
                        <Mail size={13} /> {staff.email}
                      </div>
                      {staff.phone && (
                        <div className="contact-line phone">
                          <Phone size={13} /> {staff.phone}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`status-pill ${staff.status.toLowerCase()}`}>
                        {staff.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {staff.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <button 
                        className="btn-action danger" 
                        onClick={() => handleDeleteStaff(staff.id)}
                        title="Remove Staff Member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popups / Modals */}
      <AddCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />

      <AddStaffModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onStaffAdded={handleStaffAdded}
        categories={categories}
      />

      <style>{`
        .accounts-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .accounts-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ah-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ah-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        .ah-title-wrap h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }

        .ah-title-wrap p {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 2px;
        }

        .ah-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-outline-green {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #059669;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }

        .btn-outline-green:hover {
          background: #d1fae5;
          border-color: #34d399;
        }

        .categories-summary-bar {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          overflow-x: auto;
        }

        .cs-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
        }

        .category-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }

        .cat-pill {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .cat-pill:hover {
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .cat-pill.active {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .table-toolbar {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .search-filter-box {
          position: relative;
          flex: 1;
          max-width: 450px;
        }

        .sf-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .sf-input {
          padding-left: 42px;
        }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-dropdown-wrap {
          position: relative;
        }

        .fd-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .select-filter {
          padding: 9px 14px 9px 36px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #475569;
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }

        .btn-icon-light {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .staff-table-card {
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .staff-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .staff-table th {
          padding: 14px 18px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
          background: #f8fafc;
        }

        .staff-table td {
          padding: 14px 18px;
          font-size: 0.88rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .staff-table tbody tr:hover {
          background: #f8fafc;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .staff-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .staff-meta {
          display: flex;
          flex-direction: column;
        }

        .staff-name {
          font-weight: 600;
          color: #0f172a;
        }

        .staff-id {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .category-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }

        .role-cell {
          font-weight: 500;
          color: #334155;
        }

        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .contact-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #475569;
        }

        .contact-line.phone {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-pill.active { background: #dcfce7; color: #15803d; }
        .status-pill.inactive { background: #fef2f2; color: #b91c1c; }

        .text-right { text-align: right; }

        .btn-action.danger {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-action.danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .table-empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Accounts;
