import React from "react";
import { ShoppingBag } from "@phosphor-icons/react";

export default function ProductCard({ product, onAddToCart, onProductClick, style }) {
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
          z-index: 10;
          color: #000000;
          transition: var(--transition-fast);
        }
        .quick-add-circle:hover {
          transform: scale(1.06);
          background: #000000;
          color: #ffffff;
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
          overflow: "hidden",
          width: "100%",
          aspectRatio: "3/4",
          borderRadius: "14px"
        }}
      >
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
        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="quick-add-circle pointer"
          title="Add to Cart"
          aria-label="Add to Cart"
        >
          <ShoppingBag size={18} weight="bold" />
        </button>

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
