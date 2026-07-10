import React, { useState, useEffect } from "react";
import { UploadSimple, X } from "@phosphor-icons/react";

export default function EditCategoryModal({ isOpen, onClose, onSave, collections = [], category }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    collectionName: ""
  });
  const [thumbnail, setThumbnail] = useState(null); // File object
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        collectionName: category.collectionName || ""
      });
      setThumbnail(null);
      setExistingThumbnailUrl(category.thumbnail || "");
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('collectionName', formData.collectionName);
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    } else {
      data.append('existingThumbnailUrl', existingThumbnailUrl);
    }
    setIsSaving(true);
    try {
      await onSave(data);
      onClose();
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

        .form-group {
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

        .media-dropzone {
          border: 2px dashed #E4E4E7;
          border-radius: 12px;
          height: 120px;
          width: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #A1A1AA;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .media-dropzone:hover {
          border-color: #0F0F0F;
          color: #0F0F0F;
        }

        .media-dropzone svg {
          margin-bottom: 8px;
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
          <h2 className="modal-title">Edit Category</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input name="name" className="form-input" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Collection</label>
            <select name="collectionName" className="form-select" value={formData.collectionName} onChange={handleChange}>
              <option value="" disabled hidden>Select Collection</option>
              {collections.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category Thumbnail (Shows in Circles)</label>
            <label className="media-dropzone" htmlFor="edit-category-thumb">
              {thumbnail ? (
                <img src={URL.createObjectURL(thumbnail)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              ) : existingThumbnailUrl ? (
                <img src={existingThumbnailUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              ) : (
                <>
                  <UploadSimple size={24} weight="bold" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Drag & Drop or Click</span>
                </>
              )}
            </label>
            <input 
              type="file" 
              id="edit-category-thumb" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setThumbnail(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
