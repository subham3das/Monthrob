import React, { useState } from "react";
import { Plus, Trash, FolderPlus, Tag, ShoppingBagOpen } from "@phosphor-icons/react";

export default function AdminPanel({
  collections,
  products,
  onAddCollection,
  onDeleteCollection,
  onAddProduct,
  onDeleteProduct,
  orders = [],
  onUpdateOrderStatus,
  onUpdateOrderCourierLink
}) {
  const [activeTab, setActiveTab] = useState("products");
  
  // Collection Form State
  const [newColName, setNewColName] = useState("");
  const [newColImg, setNewColImg] = useState("");
  const [newColText, setNewColText] = useState("");
  const [newColTextColor, setNewColTextColor] = useState("#FFFFFF");
  const [newColSubtext, setNewColSubtext] = useState("");

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImg, setProdImg] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodCols, setProdCols] = useState([]);

  // Courier Input state map (key: orderId, value: linkText)
  const [courierInputs, setCourierInputs] = useState({});

  const handleAddCollectionSubmit = (e) => {
    e.preventDefault();
    if (newColName.trim()) {
      onAddCollection({
        name: newColName.trim(),
        image: newColImg.trim(),
        circleText: newColText.trim() || newColName.trim().toUpperCase(),
        circleTextColor: newColTextColor.trim() || "#FFFFFF",
        subtext: newColSubtext.trim() || null
      });
      setNewColName("");
      setNewColImg("");
      setNewColText("");
      setNewColTextColor("#FFFFFF");
      setNewColSubtext("");
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (prodName.trim() && prodPrice && prodImg.trim() && prodCols.length > 0) {
      onAddProduct({
        name: prodName.trim(),
        price: Number(prodPrice),
        image: prodImg.trim(),
        description: prodDesc.trim() || "Premium fashion statement item.",
        collections: prodCols
      });
      setProdName("");
      setProdPrice("");
      setProdImg("");
      setProdDesc("");
      setProdCols([]);
    } else {
      alert("Please fill all required fields and select at least one collection.");
    }
  };

  const handleToggleColCheckbox = (col) => {
    const colName = col.name || col;
    if (prodCols.includes(colName)) {
      setProdCols(prodCols.filter(c => c !== colName));
    } else {
      setProdCols([...prodCols, colName]);
    }
  };

  const autofillImage = (num) => {
    const images = [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ];
    setProdImg(images[num]);
  };

  const handleCourierSave = (orderId) => {
    const text = courierInputs[orderId] || "";
    onUpdateOrderCourierLink(orderId, text.trim());
    alert("Courier tracking link updated successfully!");
  };

  return (
    <div style={{
      minHeight: "80vh",
      padding: "3rem 2rem 100px",
      maxWidth: "1100px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "2.5rem"
    }}>
      <style>{`
        .admin-tabs {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.5rem;
        }
        .admin-tab-btn {
          background: transparent;
          border: none;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          color: var(--color-foreground);
          opacity: 0.6;
          cursor: pointer;
          transition: var(--transition-fast);
          position: relative;
        }
        .admin-tab-btn.active {
          opacity: 1;
          color: var(--color-primary);
        }
        .admin-tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -9px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--color-primary);
          border-radius: 999px;
        }
        .admin-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .admin-card {
          padding: 2rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: fit-content;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }
        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.9;
        }
        .form-input {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: rgba(255,255,255,0.3);
          color: var(--color-foreground);
          outline: none;
          font-family: var(--font-body);
        }
        .form-input:focus {
          border-color: var(--color-primary);
          background: rgba(255,255,255,0.7);
        }
        .list-items-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 550px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }
        .orders-table-card {
          width: 100%;
          background: rgba(255,255,255,0.4);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--color-border);
        }
        .admin-orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-order-row-card {
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-order-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.75rem;
        }
        .admin-order-mid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin-order-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
        }
        .status-select {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: #ffffff;
          font-family: var(--font-heading);
          font-weight: 700;
          outline: none;
        }
        .courier-input-group {
          display: flex;
          gap: 8px;
          align-items: center;
          flex: 1;
          max-width: 400px;
        }
        @media (max-width: 900px) {
          .admin-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>

      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.5rem" }}>
          Admin Dashboard
        </h2>
        <p style={{ opacity: 0.7 }}>Manage collections, catalog products, and customer orders. Updates persist locally.</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("products")}
          className={`admin-tab-btn pointer ${activeTab === "products" ? "active" : ""}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`admin-tab-btn pointer ${activeTab === "collections" ? "active" : ""}`}
        >
          Manage Collections
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`admin-tab-btn pointer ${activeTab === "orders" ? "active" : ""}`}
        >
          Manage Orders ({orders.length})
        </button>
      </div>

      {/* Content: Manage Collections */}
      {activeTab === "collections" && (
        <div className="admin-layout-grid">
          {/* Add Collection Form */}
          <form onSubmit={handleAddCollectionSubmit} className="admin-card glass">
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FolderPlus size={22} color="var(--color-primary)" />
              <span>Create Collection</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Collection Name *</label>
              <input
                type="text"
                placeholder="e.g. Tshirt"
                className="form-input"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Circle Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                value={newColImg}
                onChange={(e) => setNewColImg(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inner Circle Text (Optional)</label>
              <input
                type="text"
                placeholder="e.g. TSHIRT"
                className="form-input"
                value={newColText}
                onChange={(e) => setNewColText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inner Circle Text Color (Optional)</label>
              <input
                type="color"
                className="form-input"
                style={{ height: "45px", padding: "4px", width: "100px", cursor: "pointer" }}
                value={newColTextColor}
                onChange={(e) => setNewColTextColor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subtext Below Circle (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Summer 2026"
                className="form-input"
                value={newColSubtext}
                onChange={(e) => setNewColSubtext(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary pointer" style={{ justifyContent: "center" }}>
              <Plus size={16} weight="bold" />
              <span>Create Collection</span>
            </button>
          </form>

          {/* Active Collections List */}
          <div className="admin-card glass">
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>Active Collections ({collections.length})</h3>
            <div className="list-items-container">
              {collections.map((col, idx) => {
                const name = col.name || col;
                const isAll = name === "All" || name === "All Products";
                return (
                  <div key={idx} className="list-item">
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontWeight: 700 }}>{name}</span>
                      {col.subtext && <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>{col.subtext}</p>}
                    </div>
                    {!isAll && (
                      <button
                        onClick={() => onDeleteCollection(name)}
                        className="pointer"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--color-destructive)",
                          display: "flex",
                          alignItems: "center",
                          padding: "0.25rem"
                        }}
                        title="Delete Collection"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content: Manage Products */}
      {activeTab === "products" && (
        <div className="admin-layout-grid">
          {/* Add Product Form */}
          <form onSubmit={handleAddProductSubmit} className="admin-card glass">
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={22} color="var(--color-primary)" />
              <span>Publish Product</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                placeholder="e.g. Mon Jai Edition"
                className="form-input"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (Rs.) *</label>
              <input
                type="number"
                placeholder="e.g. 899"
                className="form-input"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input
                type="text"
                placeholder="Paste unsplash or web image url..."
                className="form-input"
                value={prodImg}
                onChange={(e) => setProdImg(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: "var(--color-primary)", fontWeight: 700 }}>Quick Autofill:</span>
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => autofillImage(num)}
                    className="pointer"
                    style={{ fontSize: "10px", padding: "2px 6px", border: "1px solid var(--color-border)", borderRadius: "4px", background: "#ffffff" }}
                  >
                    Image {num + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                placeholder="Tell us about the garment fit, details..."
                className="form-input"
                style={{ resize: "vertical", minHeight: "80px" }}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Add to Collections * (Select at least one)</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                padding: "0.5rem 0"
              }}>
                {collections.filter(c => (c.name || c) !== "All" && (c.name || c) !== "All Products").map((col, i) => {
                  const name = col.name || col;
                  return (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={prodCols.includes(name)}
                        onChange={() => handleToggleColCheckbox(col)}
                        style={{ cursor: "pointer" }}
                      />
                      <span>{name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary pointer" style={{ justifyContent: "center" }}>
              <Plus size={16} weight="bold" />
              <span>Publish Product</span>
            </button>
          </form>

          {/* Product Catalog */}
          <div className="admin-card glass">
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>Catalog Products ({products.length})</h3>
            <div className="list-items-container">
              {products.map((prod) => (
                <div key={prod.id} className="list-item" style={{ gap: "1rem" }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {prod.name}
                    </h4>
                    <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      Rs. {prod.price} | {prod.collections.join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="pointer"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-destructive)",
                      display: "flex",
                      alignItems: "center",
                      padding: "0.25rem",
                      flexShrink: 0
                    }}
                    title="Delete Product"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content: Manage Orders */}
      {activeTab === "orders" && (
        <div className="orders-table-card glass">
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <ShoppingBagOpen size={22} color="var(--color-primary)" />
            <span>Customer Orders Management ({orders.length})</span>
          </h3>

          {orders.length === 0 ? (
            <div style={{ padding: "3rem 1rem", color: "#999999", textAlign: "center" }}>
              No client orders placed yet.
            </div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div key={order.id} className="admin-order-row-card">
                  
                  {/* Row Header */}
                  <div className="admin-order-top">
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "16px", color: "#0D0D0D" }}>Order #{order.id}</span>
                      <span style={{ fontSize: "12px", color: "#71717A", marginLeft: "10px" }}>Ordered on: {order.date}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#71717A", marginRight: "6px" }}>Status:</span>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Row Mid: Products List */}
                  <div className="admin-order-mid">
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                        <span style={{ color: "#4B5563" }}>• {item.name} <strong>x{item.quantity}</strong></span>
                        <span style={{ fontWeight: 600 }}>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Row Bottom: Link + Total */}
                  <div className="admin-order-bottom">
                    <div className="courier-input-group">
                      <input
                        type="text"
                        placeholder="Paste Courier Tracking Link..."
                        className="form-input"
                        style={{ padding: "6px 10px", fontSize: "12px", flex: 1 }}
                        value={courierInputs[order.id] !== undefined ? courierInputs[order.id] : (order.courierLink || "")}
                        onChange={(e) => setCourierInputs({ ...courierInputs, [order.id]: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => handleCourierSave(order.id)}
                        className="btn-primary pointer"
                        style={{ padding: "8px 12px", fontSize: "11px", height: "fit-content", flexShrink: 0 }}
                      >
                        Save Link
                      </button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "#71717A" }}>Order Total:</span>
                      <strong style={{ fontSize: "16px", color: "#0D0D0D", marginLeft: "8px" }}>Rs. {order.total}</strong>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
