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
  Trash2,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/apiConfig';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';

const Accounts = () => {
  const [staffList, setStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [catRes, staffRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/accounts/categories/`, config),
        axios.get(`${API_BASE_URL}/api/accounts/staff/`, config)
      ]);

      if (Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
      if (Array.isArray(staffRes.data)) {
        setStaffList(staffRes.data);
      }
    } catch (err) {
      console.error('Error fetching dynamic staff directory data from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    fetchData();
  };

  const handleEditCategoryClick = (cat, e) => {
    if (e) e.stopPropagation();
    setEditingCategory(cat);
    setIsEditCategoryModalOpen(true);
  };

  const handleCategoryUpdated = (updatedCat) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? { ...c, ...updatedCat } : c))
    );
    fetchData();
  };

  const handleDeleteCategory = async (catId, catName, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete category "${catName}"? Staff members in this category will become unassigned.`)) return;

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_BASE_URL}/api/accounts/categories/${catId}/`, config);
      
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      if (selectedCategory === String(catId)) {
        setSelectedCategory('ALL');
      }
      fetchData();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category from database.');
    }
  };

  const handleStaffAdded = (newStaff) => {
    setStaffList((prev) => [newStaff, ...prev]);
    fetchData();
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setIsEditStaffModalOpen(true);
  };

  const handleStaffUpdated = (updatedStaff) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? { ...s, ...updatedStaff } : s))
    );
    fetchData();
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_BASE_URL}/api/accounts/staff/${id}/`, config);
    } catch (err) {
      console.error('Error deleting staff member:', err);
    }
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    fetchData();
  };

  const getCategoryStaffCount = (catId, catName) => {
    return staffList.filter((staff) => {
      if (!staff) return false;
      const sCatId = typeof staff.category === 'object' ? staff.category?.id : staff.category;
      return String(sCatId) === String(catId) || staff.category_name === catName;
    }).length;
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = 
      staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.category_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const sCatId = typeof staff.category === 'object' ? staff.category?.id : staff.category;
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      String(sCatId) === String(selectedCategory) ||
      staff.category_name === categories.find(c => String(c.id) === String(selectedCategory))?.name;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="accounts-container animate-fade-in">
      {/* Top Action Header */}
      <div className="accounts-header">
        <div className="ah-title-wrap">
          <div className="ah-icon-badge">
            <Users size={20} />
          </div>
          <div>
            <h2>Staff & Accounts Directory</h2>
            <p>Manage MEDA staff members, roles, and organizational divisions</p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="ah-actions">
          <button 
            className="btn-outline-green" 
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <FolderPlus size={16} />
            <span>Add Category</span>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => setIsStaffModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Category Summary & Filter Bar */}
      <div className="categories-summary-bar light-card">
        <div className="cs-title">
          <Layers size={15} color="#10b981" /> <span>Categories ({categories.length}):</span>
        </div>
        <div className="category-pills">
          <button 
            className={`cat-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Staff ({staffList.length})
          </button>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`cat-pill-item ${selectedCategory === String(cat.id) ? 'active' : ''}`}
            >
              <button 
                className="cat-pill-btn"
                onClick={() => setSelectedCategory(String(cat.id))}
              >
                <span>{cat.name}</span>
                <span className="cat-count">({getCategoryStaffCount(cat.id, cat.name)})</span>
              </button>
              <div className="cat-pill-actions">
                <button 
                  className="cat-act-icon edit" 
                  onClick={(e) => handleEditCategoryClick(cat, e)}
                  title={`Edit category "${cat.name}"`}
                >
                  <Edit size={12} />
                </button>
                <button 
                  className="cat-act-icon delete" 
                  onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                  title={`Delete category "${cat.name}"`}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="table-toolbar light-card">
        <div className="search-filter-box">
          <Search size={16} className="sf-icon" />
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
            <Filter size={15} className="fd-icon" />
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
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
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
                    <RefreshCw size={18} className="spin" /> Loading staff directory...
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
                  <tr key={staff.id} className="table-row-hover">
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
                        <Briefcase size={12} /> {staff.category_name || 'General'}
                      </span>
                    </td>

                    <td className="role-cell">{staff.role}</td>

                    <td className="contact-cell">
                      <div className="contact-line">
                        <Mail size={12} /> {staff.email}
                      </div>
                      {staff.phone && (
                        <div className="contact-line phone">
                          <Phone size={12} /> {staff.phone}
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
                      <div className="action-buttons-cell">
                        <button 
                          className="btn-action edit" 
                          onClick={() => handleEditClick(staff)}
                          title="Edit Staff Details"
                        >
                          <Edit size={14} />
                        </button>

                        <button 
                          className="btn-action danger" 
                          onClick={() => handleDeleteStaff(staff.id)}
                          title="Remove Staff Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onCategoryUpdated={handleCategoryUpdated}
        category={editingCategory}
      />

      <AddStaffModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onStaffAdded={handleStaffAdded}
        categories={categories}
      />

      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => setIsEditStaffModalOpen(false)}
        onStaffUpdated={handleStaffUpdated}
        staff={editingStaff}
        categories={categories}
      />

      <style>{`
        .accounts-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cat-pill-item {
          display: inline-flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2px 6px 2px 10px;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .cat-pill-item:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .cat-pill-item.active {
          background: #059669;
          border-color: #059669;
          color: #ffffff;
        }

        .cat-pill-btn {
          background: transparent;
          border: none;
          color: inherit;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 0;
          white-space: nowrap;
        }

        .cat-pill-item.active .cat-pill-btn {
          color: #ffffff;
        }

        .cat-count {
          opacity: 0.85;
          font-size: 0.68rem;
        }

        .cat-pill-actions {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: 2px;
        }

        .cat-act-icon {
          background: transparent;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.15s ease;
          padding: 0;
        }

        .cat-pill-item.active .cat-act-icon {
          color: rgba(255, 255, 255, 0.85);
        }

        .cat-act-icon.edit:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #2563eb;
        }

        .cat-pill-item.active .cat-act-icon.edit:hover {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .cat-act-icon.delete:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #dc2626;
        }

        .cat-pill-item.active .cat-act-icon.delete:hover {
          background: rgba(239, 68, 68, 0.4);
          color: #ffffff;
        }


        .accounts-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #082d38 0%, #0f172a 100%);
          border-radius: 12px;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(8, 45, 56, 0.12);
        }

        .ah-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ah-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .ah-title-wrap h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.2px;
        }

        .ah-title-wrap p {
          font-size: 0.75rem;
          color: #829ab1;
          margin-top: 1px;
        }

        .ah-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-primary {
          background: #10b981;
          border: none;
          color: #ffffff;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .btn-outline-green {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .btn-outline-green:hover {
          background: rgba(16, 185, 129, 0.22);
          border-color: #34d399;
          transform: translateY(-1px);
        }

        .categories-summary-bar {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .cs-title {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #475569;
          white-space: nowrap;
        }

        .category-pills {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
        }

        .cat-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .cat-pill:hover {
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .cat-pill.active {
          background: #059669;
          color: #ffffff;
          border-color: #059669;
        }

        .table-toolbar {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .search-filter-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .sf-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .sf-input {
          padding: 5px 12px 5px 36px;
          font-size: 0.75rem;
          border-radius: 16px;
        }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-dropdown-wrap {
          position: relative;
        }

        .fd-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .select-filter {
          padding: 5px 12px 5px 32px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
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

        .action-buttons-cell {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .btn-action.edit {
          background: #dbeafe;
          border: 1px solid #bfdbfe;
          color: #2563eb;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-action.edit:hover {
          background: #bfdbfe;
          color: #1d4ed8;
          transform: translateY(-1px);
        }

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
          transform: translateY(-1px);
        }

        .table-empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile View Alignments & Responsive Controls */
        @media (max-width: 680px) {
          .accounts-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .ah-actions {
            width: 100%;
            display: flex;
            gap: 8px;
          }

          .ah-actions button {
            flex: 1;
            justify-content: center;
            padding: 8px 10px;
            font-size: 0.78rem;
          }

          .categories-summary-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .category-pills {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 4px;
            flex-wrap: nowrap;
          }

          .cat-pill {
            white-space: nowrap;
            flex-shrink: 0;
          }

          .table-toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .search-filter-box {
            max-width: 100%;
            width: 100%;
          }

          .toolbar-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Accounts;
