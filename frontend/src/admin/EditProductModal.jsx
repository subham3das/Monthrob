import React, { useState, useEffect } from "react";
import { UploadSimple, X } from "@phosphor-icons/react";

export default function EditProductModal({ isOpen, onClose, onSave, categories = [], collections = [], initialData = {} }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mrp: "",
    sellingPrice: "",
    stock: 0,
    category: "",
    collection: "None",
    shortDesc: "",
    material: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [discount, setDiscount] = useState("0% OFF");
  
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");

  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        mrp: initialData.mrp || "",
        sellingPrice: initialData.price || "",
        stock: initialData.stock || 0,
        category: initialData.category?._id || "",
        collection: initialData.collectionName || "None",
        shortDesc: initialData.description || "",
        material: initialData.material || "",
      });
      setColors(initialData.colors || []);
      setSizes(initialData.sizes || []);
      setTags(initialData.tags || []);
      setExistingImages(initialData.images || []);
      setImages([]);
    }
  }, [initialData, isOpen]);

  // Calculate discount when MRP or Selling Price changes
  useEffect(() => {
    const mrp = parseFloat(formData.mrp);
    const sp = parseFloat(formData.sellingPrice);
    if (mrp > 0 && sp > 0 && mrp > sp) {
      const perc = Math.round(((mrp - sp) / mrp) * 100);
      setDiscount(`${perc}% OFF`);
    } else {
      setDiscount("0% OFF");
    }
  }, [formData.mrp, formData.sellingPrice]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (col) => setColors(colors.filter(c => c !== col));

  const toggleSize = (sz) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter(s => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleAddCustomSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const uniqueNewTags = newTags.filter(t => !tags.includes(t));
      const combinedTags = [...tags, ...uniqueNewTags].slice(0, 20);
      setTags(combinedTags);
      setTagInput("");
    }
  };

  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  const handleSave = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('mrp', formData.mrp);
    data.append('price', formData.sellingPrice);
    if (formData.category) data.append('category', formData.category);
    data.append('collectionName', formData.collection === 'None' ? '' : formData.collection);
    data.append('description', formData.shortDesc);
    data.append('material', formData.material);
    data.append('stock', formData.stock);
    const finalColors = [...colors];
    if (colorInput && !colors.includes(colorInput)) finalColors.push(colorInput);
    data.append('colors', JSON.stringify(finalColors));

    const finalSizes = [...sizes];
    if (sizeInput && !sizes.includes(sizeInput)) finalSizes.push(sizeInput);
    data.append('sizes', JSON.stringify(finalSizes));
    data.append('tags', JSON.stringify(tags));
    data.append('existingImages', JSON.stringify(existingImages));
    
    images.forEach(img => {
      data.append('images', img);
    });

    setIsSaving(true);
    try {
      await onSave(initialData._id, data);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Use the collections prop directly
  const filteredCategories = (formData.collection === "None" || !formData.collection)
    ? [] 
    : categories.filter(c => c.collectionName === formData.collection);

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
          max-width: 800px;
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

        .form-input, .form-select, .form-textarea {
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

        .form-input:focus, .form-select:focus, .form-textarea:focus {
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

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .discount-box {
          background: #E8F5E9;
          color: #2E7D32;
          font-weight: 700;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        .section-card {
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #1A1A1A;
          margin-bottom: 4px;
        }

        .input-with-btn {
          display: flex;
          gap: 12px;
        }

        .btn-black {
          background: #0F0F0F;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0 24px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-black:hover {
          background: #2a2a2a;
        }
        
        .color-preview {
          width: 42px;
          height: 42px;
          background: #000;
          border-radius: 8px;
          border: 1px solid #E4E4E7;
          flex-shrink: 0;
        }

        .sizes-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .size-pill {
          padding: 8px 16px;
          border: 1px solid #E4E4E7;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          background: #FFFFFF;
          color: #1A1A1A;
          transition: all 0.2s;
        }

        .size-pill.active {
          background: #0F0F0F;
          color: #FFFFFF;
          border-color: #0F0F0F;
        }

        .helper-text {
          font-size: 12px;
          color: #A1A1AA;
          margin-top: -4px;
        }

        .media-gallery {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .media-slot {
          border: 2px dashed #E4E4E7;
          border-radius: 8px;
          height: 160px;
          width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #A1A1AA;
          cursor: pointer;
          transition: border-color 0.2s;
          position: relative;
          overflow: hidden;
          background: #FAFAFA;
        }

        .media-slot:hover {
          border-color: #0F0F0F;
          color: #0F0F0F;
        }
        
        .media-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .media-slot svg {
          margin-bottom: 8px;
        }

        .remove-media-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
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

        .tag-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .tag-item {
          background: #F4F4F5;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .tag-item span {
          cursor: pointer;
        }
      `}</style>

      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Product</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input name="name" className="form-input" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">MRP (Highest)</label>
              <input type="number" name="mrp" className="form-input" value={formData.mrp} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Selling Price</label>
              <input type="number" name="sellingPrice" className="form-input" value={formData.sellingPrice} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (Stock)</label>
              <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Discount</label>
              <div className="discount-box">{discount}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Collection</label>
              <select name="collection" className="form-select" value={formData.collection} onChange={handleChange}>
                <option value="None">None</option>
                {collections.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                name="category" 
                className="form-select" 
                value={formData.category} 
                onChange={handleChange}
                disabled={formData.collection === "None" || !formData.collection}
              >
                <option value="" disabled hidden>
                  {formData.collection === "None" || !formData.collection ? "Select a collection first..." : "Select Category..."}
                </option>
                {filteredCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea 
              name="shortDesc" 
              className="form-textarea" 
              placeholder="Brief overview for the top of the page..."
              value={formData.shortDesc} 
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Material & Care Details</label>
            <textarea 
              name="material" 
              className="form-textarea" 
              placeholder="Detailed material info..."
              value={formData.material} 
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Material & Care Details</label>
            <textarea 
              name="material" 
              className="form-textarea" 
              placeholder="Detailed material info..."
              value={formData.material} 
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="section-title">Manage Colors</label>
            <div className="section-card">
              <div className="input-with-btn">
                <input 
                  type="color"
                  className="color-preview" 
                  style={{ padding: 0, cursor: 'pointer', border: '1px solid #E4E4E7' }}
                  value={colorInput.startsWith('#') && colorInput.length === 7 ? colorInput : '#000000'}
                  onChange={(e) => setColorInput(e.target.value)}
                  title="Choose a color"
                />
                <input 
                  className="form-input" 
                  placeholder="e.g. Midnight Black or pick a color" 
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                />
                <button className="btn-black" onClick={handleAddColor}>Add</button>
              </div>
              {colors.length > 0 && (
                <div className="tag-list">
                  {colors.map(c => (
                    <div key={c} className="tag-item">
                      {c} <span onClick={() => removeColor(c)}><X size={12} weight="bold"/></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="section-title">Manage Sizes</label>
            <div className="section-card">
              <div className="sizes-row">
                {standardSizes.map(sz => (
                  <button 
                    key={sz} 
                    className={`size-pill ${sizes.includes(sz) ? 'active' : ''}`}
                    onClick={() => toggleSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <div className="input-with-btn">
                <input 
                  className="form-input" 
                  placeholder="Custom size (e.g. One Size)" 
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                />
                <button type="button" className="btn-black" onClick={handleAddCustomSize}>Add</button>
              </div>
              {sizes.length > 0 && (
                <div className="tag-list">
                  {sizes.map(s => (
                    <div key={s} className="tag-item">
                      {s} <span onClick={() => toggleSize(s)}><X size={12} weight="bold"/></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="section-title">Meta Tags</label>
            <div className="section-card">
              <div className="input-with-btn">
                <input 
                  className="form-input" 
                  placeholder="e.g. oversized, streetwear, hoodie" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button type="button" className="btn-black" onClick={handleAddTag}>Add</button>
              </div>
              <div className="helper-text">Meta tags help customers find this product via search (Max 20)</div>
              {tags.length > 0 && (
                <div className="tag-list">
                  {tags.map(t => (
                    <div key={t} className="tag-item">
                      {t} <span onClick={() => removeTag(t)}><X size={12} weight="bold"/></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="section-title">Product Media (Drag & Drop up to 5)</label>
            <div className="media-gallery">
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="media-slot">
                  <img src={src} alt={`existing-${i}`} />
                  <button 
                    type="button" 
                    className="remove-media-btn" 
                    onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
              {images.map((img, i) => (
                <div key={`new-${i}`} className="media-slot">
                  <img src={URL.createObjectURL(img)} alt={`upload-${i}`} />
                  <button 
                    type="button" 
                    className="remove-media-btn" 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
              
              {(existingImages.length + images.length) < 5 && (
                <label className="media-slot" htmlFor="edit-product-images">
                  <UploadSimple size={24} weight="bold" />
                  <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center', padding: '0 4px' }}>Add Image</span>
                  <input 
                    type="file" 
                    id="edit-product-images" 
                    multiple 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files);
                      const currentCount = existingImages.length + images.length;
                      setImages([...images, ...newFiles].slice(0, 5 - currentCount));
                    }}
                  />
                </label>
              )}
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Product"}</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
