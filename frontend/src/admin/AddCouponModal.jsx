import React, { useState } from "react";
import { X } from "@phosphor-icons/react";

export default function AddCouponModal({ isOpen, onClose, onSave }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxUsers: 100,
    limitPerUser: 1,
    expiresAt: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.code.trim()) return setError('Coupon code is required');
    if (formData.value <= 0) return setError('Value must be > 0');
    if (formData.type === 'percentage' && formData.value > 100) return setError('Percentage cannot exceed 100');
    setError('');
    setIsSaving(true);
    try {
      await onSave({ ...formData, value: Number(formData.value), maxUsers: Number(formData.maxUsers), limitPerUser: Number(formData.limitPerUser), minOrderAmount: Number(formData.minOrderAmount), expiresAt: formData.expiresAt || null });
      onClose();
    } catch(e) {
      setError(e?.response?.data?.message || 'Failed to create coupon');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          overflow: hidden;
          font-family: var(--font-body, 'Outfit', sans-serif);
        }

        .modal-content {
          background: #FFFFFF;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          position: relative;
          display: flex;
          flex-direction: column;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #F4F4F5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          z-index: 10;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #A1A1AA;
          display: flex;
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
        }

        .close-btn:hover {
          background: #F4F4F5;
          color: #1A1A1A;
        }

        .modal-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 800;
          color: #1A1A1A;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          font-family: inherit;
          font-size: 14px;
          color: #1A1A1A;
          background-color: #FAFAFA;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .form-input:focus, .form-select:focus {
          border-color: #0F0F0F;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(15, 15, 15, 0.1);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%231A1A1A' viewBox='0 0 256 256'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }

        .modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #F4F4F5;
          display: flex;
          gap: 16px;
          background: #fff;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          flex-shrink: 0;
        }

        .btn-save {
          flex: 1;
          background: #0F0F0F;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-save:hover {
          background: #2a2a2a;
        }

        .btn-cancel {
          flex: 1;
          background: #fff;
          color: #1A1A1A;
          border: 1px solid #E4E4E7;
          padding: 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-cancel:hover {
          background: #F4F4F5;
        }
      `}</style>

      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">New Discount Coupon</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="modal-body">
          {error && <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600, padding: '8px 12px', background: '#FEF2F2', borderRadius: '8px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Coupon Code</label>
            <input name="code" className="form-input" placeholder="e.g. SUMMER50" value={formData.code} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Value</label>
              <input type="number" name="value" className="form-input" min="1" max={formData.type === 'percentage' ? 100 : undefined} value={formData.value} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max Overall Uses</label>
              <input type="number" name="maxUsers" className="form-input" min="1" value={formData.maxUsers} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Limit Per User</label>
              <input type="number" name="limitPerUser" className="form-input" min="1" value={formData.limitPerUser} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Min Order Amount (₹)</label>
              <input type="number" name="minOrderAmount" className="form-input" min="0" value={formData.minOrderAmount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Expires At (optional)</label>
              <input type="date" name="expiresAt" className="form-input" value={formData.expiresAt} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Create Coupon"}</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
