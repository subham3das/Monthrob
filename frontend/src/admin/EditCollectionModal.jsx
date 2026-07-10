import React, { useState, useRef, useEffect } from "react";
import { X, UploadSimple } from "@phosphor-icons/react";

export default function EditCollectionModal({ isOpen, onClose, onSave, collection }) {
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (collection) {
      setName(collection.name || "");
      setImagePreview(collection.image || null);
      setExistingImageUrl(collection.image || "");
      setImageFile(null);
    }
  }, [collection, isOpen]);

  if (!isOpen || !collection) return null;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const data = new FormData();
      data.append('name', name.trim());
      if (imageFile) {
        data.append('image', imageFile);
      } else {
        data.append('existingImageUrl', existingImageUrl);
      }
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
          font-family: var(--font-body, 'Outfit', sans-serif);
        }
        .modal-content {
          background: #FFFFFF;
          width: 100%;
          max-width: 420px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #F4F4F5;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
          display: flex;
        }
        .close-btn:hover { background: #F4F4F5; color: #1A1A1A; }
        .modal-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-label {
          font-size: 13px;
          font-weight: 800;
          color: #1A1A1A;
          margin-bottom: 8px;
          display: block;
        }
        .form-input {
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
          box-sizing: border-box;
        }
        .form-input:focus { border-color: #0F0F0F; background-color: #FFFFFF; }
        .drop-zone {
          border: 2px dashed #E4E4E7;
          border-radius: 12px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #FAFAFA;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .drop-zone.dragging {
          border-color: #0F0F0F;
          background: #F4F4F5;
        }
        .drop-zone-preview {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
        }
        .drop-zone-label {
          font-size: 13px;
          color: #71717A;
          font-weight: 500;
        }
        .drop-zone-label strong {
          color: #1A1A1A;
          font-weight: 800;
        }
        .remove-img-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #F4F4F5;
          display: flex;
          gap: 16px;
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
        .btn-save:hover { background: #2a2a2a; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
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
        .btn-cancel:hover { background: #F4F4F5; }
      `}</style>

      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Collection</h2>
          <button className="close-btn" onClick={onClose}><X size={24} weight="bold" /></button>
        </div>

        <div className="modal-body">
          <div>
            <label className="form-label">Collection Name</label>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Summer Collection"
            />
          </div>

          <div>
            <label className="form-label">Collection Image</label>
            <div
              className={`drop-zone ${isDragging ? "dragging" : ""}`}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="drop-zone-preview" />
                  <button
                    className="remove-img-btn"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); setExistingImageUrl(""); }}
                  >
                    <X size={14} weight="bold" />
                  </button>
                </>
              ) : (
                <>
                  <UploadSimple size={32} color="#A1A1AA" />
                  <span className="drop-zone-label">
                    <strong>Click to upload</strong> or drag &amp; drop<br />
                    PNG, JPG, WEBP supported
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
