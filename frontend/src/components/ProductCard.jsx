import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, X, Check } from "@phosphor-icons/react";

export default function ProductCard({ product, onAddToCart, onProductClick, style }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const popupRef = useRef(null);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  const needsSelection = hasSizes || hasColors;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!needsSelection) {
      onAddToCart(product);
      return;
    }
    setSelectedSize(null);
    setSelectedColor(null);
    setShowPopup(true);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (!hasSizes) {
      onAddToCart({ ...product, selectedColor: color, selectedSize: null });
      setShowPopup(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (!hasColors) {
      onAddToCart({ ...product, selectedColor: null, selectedSize: size });
      setShowPopup(false);
    } else if (selectedColor) {
      onAddToCart({ ...product, selectedColor, selectedSize: size });
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (selectedSize !== null && selectedColor !== null && showPopup) {
      onAddToCart({ ...product, selectedColor, selectedSize });
      setShowPopup(false);
    }
  }, [selectedSize, selectedColor]);

  return (
    <div
      className="product-card"
      onClick={onProductClick}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style
      }}
    >
      <style>{`
        .product-card-img-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 14px;
        }
        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.03);
        }
        .quick-add-circle {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          z-index: 20;
          color: #000000;
          transition: var(--transition-fast);
          cursor: pointer;
        }
        .quick-add-circle:hover {
          transform: scale(1.06);
          background: #000000;
          color: #ffffff;
        }
        .size-popup {
          position: absolute;
          top: 52px;
          right: 4px;
          z-index: 30;
          background: #ffffff;
          border-radius: 12px;
          padding: 10px 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          min-width: 140px;
          max-width: 180px;
        }
        .size-popup-title {
          font-size: 10px;
          font-weight: 700;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .size-popup-options {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .size-popup-btn {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border: 1.5px solid #E4E4E7;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          color: #1A1A1A;
          transition: all 0.15s;
        }
        .size-popup-btn:hover { border-color: #1A1A1A; }
        .size-popup-btn.selected { background: #1A1A1A; color: #fff; border-color: #1A1A1A; }
        .color-popup-swatch {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #E4E4E7;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .color-popup-swatch:hover { border-color: #1A1A1A; transform: scale(1.1); }
        .color-popup-swatch.selected { border-color: #1A1A1A; }
        .color-popup-swatch.selected::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .discount-badge {
          background: rgba(22, 163, 74, 0.08);
          color: #16a34a;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }
        .price-pill-container {
          background: var(--beige);
          color: var(--black);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* Padded Image Container */}
      <div
        style={{
          position: "relative",
          overflow: "visible",
          width: "100%",
          aspectRatio: "3/4",
          borderRadius: "14px"
        }}
      >
        <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", borderRadius: "14px" }}>
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="product-card-img"
          />
        </div>
        {/* Quick Add Button */}
        <button
          onClick={handleAddClick}
          className="quick-add-circle pointer"
          title="Add to Cart"
          aria-label="Add to Cart"
        >
          <ShoppingBag size={18} weight="bold" />
        </button>

        {/* Selection Popup */}
        {showPopup && (
          <div className="size-popup" ref={popupRef} onClick={e => e.stopPropagation()}>
            {hasColors && (
              <>
                <div className="size-popup-title">Color</div>
                <div className="size-popup-options" style={{ marginBottom: hasSizes ? '8px' : 0 }}>
                  {product.colors.map((hex, i) => (
                    <button
                      key={i}
                      className={`color-popup-swatch${selectedColor === hex ? ' selected' : ''}`}
                      style={{ background: hex }}
                      onClick={() => handleColorSelect(hex)}
                    />
                  ))}
                </div>
              </>
            )}
            {hasSizes && (
              <>
                <div className="size-popup-title">Size</div>
                <div className="size-popup-options">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-popup-btn${selectedSize === s ? ' selected' : ''}`}
                      onClick={() => handleSizeSelect(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Stock Badges */}
        {product.stock === 0 && (
          <span style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: 800,
            padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase'
          }}>Out of Stock</span>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <span style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            background: '#F59E0B', color: '#fff', fontSize: '10px', fontWeight: 800,
            padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase'
          }}>Low in Stock</span>
        )}
      </div>

      {/* Info Area with margins inside the card */}
      <div style={{
        padding: "0.75rem 0.25rem 0.25rem 0.25rem",
        display: "flex",
        flexDirection: "column",
        textAlign: "left"
      }}>
        {/* Title & Discount Badge */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem"
        }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#0D0D0D",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1
            }}
          >
            {product.name}
          </h3>
          {(product.discount > 0 || (product.mrp && product.price && product.mrp > product.price)) && (
            <span className="discount-badge" style={{ flexShrink: 0, marginTop: "2px", background: "rgba(22, 163, 74, 0.08)", color: "#16a34a", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 800 }}>
              {product.discount > 0 ? product.discount : Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            color: "#999999",
            margin: "2px 0 6px 0",
            padding: "0 4px",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {product.description}
          </p>
        )}

        {/* Price Block */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "0.5rem", marginTop: "4px" }}>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 800,
            color: "#1A1A1A"
          }}>
            Rs. {product.price}
          </span>
          {product.mrp > product.price && (
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              textDecoration: "line-through",
              color: "#999999"
            }}>
              Rs. {product.mrp}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
