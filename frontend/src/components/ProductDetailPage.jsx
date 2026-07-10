import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, X } from "@phosphor-icons/react";

// Using product data for colors and sizes instead of hardcoded arrays

const SIZE_CHART = [
  { size: "S",   chest: "36-38", length: "27", shoulder: "17" },
  { size: "M",   chest: "38-40", length: "28", shoulder: "18" },
  { size: "L",   chest: "40-42", length: "29", shoulder: "19" },
  { size: "XL",  chest: "42-44", length: "30", shoulder: "20" },
  { size: "XXL", chest: "44-46", length: "31", shoulder: "21" },
];

// We'll move ACCORDIONS inside the component to access product data

export default function ProductDetailPage({ product, onBack, onAddToCart }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const touchStartX = useRef(null);

  const ACCORDIONS = [
    {
      id: "material",
      label: "Material & Details",
      content: product.material || "100% Super Combed Cotton · Heavyweight Fabric · Premium Quality."
    },
    {
      id: "care",
      label: "Care Instructions",
      content: "Machine wash cold inside-out with similar colours. Use gentle cycle with mild detergent. Tumble dry on low heat or hang dry in shade. Do not dry clean. Iron inside-out on low heat. Do not iron directly on the print."
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: "Free shipping on orders above Rs. 999. Standard delivery in 4-7 business days. Express delivery available at checkout. Returns accepted within 7 days of delivery — items must be unused, unwashed, and in original packaging."
    }
  ];

  // Build image list — use product.images[] if available, else repeat product.image
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.image].filter(Boolean);

  const goNext = () => setCurrentImg((p) => (p + 1) % images.length);
  const goPrev = () => setCurrentImg((p) => (p - 1 + images.length) % images.length);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { goNext(); } else { goPrev(); } }
    touchStartX.current = null;
  };

  const handleAddToBag = () => {
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if ((hasColors && selectedColor === null) || (hasSizes && selectedSize === null)) {
      alert("Please select a color and size before adding to bag.");
      return;
    }

    onAddToCart({ 
      ...product, 
      selectedColor: hasColors ? product.colors[selectedColor] : null,
      selectedSize: hasSizes ? selectedSize : null 
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  // Prevent body scroll when page is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg((p) => (p + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="pdp-root">
      <style>{`
        .pdp-root {
          position: fixed;
          top: 70px;   /* below header */
          bottom: 65px; /* above mobile nav */
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 300;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Scrollable content wrapper ── */
        .pdp-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 76px; /* room for sticky CTA */
        }

        /* ── Image carousel ── */
        .pdp-carousel {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          max-height: 55vh;
          overflow: hidden;
          background: #F4F4F4;
          flex-shrink: 0;
        }
        .pdp-carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .pdp-carousel-slide {
          min-width: 100%;
          height: 100%;
          flex-shrink: 0;
        }
        .pdp-carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Dots */
        .pdp-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .pdp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .pdp-dot.active {
          width: 18px;
          border-radius: 3px;
          background: #ffffff;
        }

        /* Back button */
        .pdp-back-btn {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0D0D0D;
          z-index: 10;
          cursor: pointer;
          backdrop-filter: blur(4px);
        }

        /* ── Info card ── */
        .pdp-card {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          margin-top: -20px;
          position: relative;
          z-index: 2;
          padding: 1.5rem 1.25rem 0;
        }

        /* Name + Price row */
        .pdp-name {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 900;
          color: #0D0D0D;
          line-height: 1.2;
          flex: 1;
        }
        .pdp-price-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          flex-shrink: 0;
          margin-left: 10px;
        }
        .pdp-name-price-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .pdp-original-price {
          font-size: 13px;
          color: #999999;
          text-decoration: line-through;
        }
        .pdp-sale-price {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #0D0D0D;
        }
        .pdp-discount-badge {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 700;
          color: #16a34a;
          background: #DCFCE7;
          padding: 3px 8px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        /* Description */
        .pdp-desc {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #444444;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }

        /* Section label */
        .pdp-section-label {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #999999;
          margin-bottom: 10px;
        }

        /* Color picker */
        .pdp-color-row {
          display: flex;
          gap: 10px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .pdp-color-swatch {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #E2E2E2;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .pdp-color-swatch.selected {
          border-color: #0D0D0D;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0D0D0D;
          transform: scale(1.08);
        }

        /* Size picker */
        .pdp-size-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .pdp-size-guide-btn {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0D0D0D;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .pdp-size-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .pdp-size-btn {
          min-width: 48px;
          height: 42px;
          border-radius: 8px;
          border: 1.5px solid #E2E2E2;
          background: #ffffff;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          color: #0D0D0D;
          cursor: pointer;
          padding: 0 14px;
          transition: all 0.15s;
        }
        .pdp-size-btn.selected {
          background: #0D0D0D;
          color: #ffffff;
          border-color: #0D0D0D;
        }
        .pdp-size-btn:hover:not(.selected) {
          border-color: #0D0D0D;
        }

        /* ── Accordion ── */
        .pdp-accordion-list {
          margin: 0.5rem 0;
        }
        .pdp-accordion-item {
          border-top: 1px solid #E2E2E2;
        }
        .pdp-accordion-item:last-child {
          border-bottom: 1px solid #E2E2E2;
        }
        .pdp-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          background: none;
          border: none;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0D0D0D;
          cursor: pointer;
          text-align: left;
        }
        .pdp-accordion-chevron {
          font-size: 18px;
          transition: transform 0.25s;
          flex-shrink: 0;
          color: #666666;
        }
        .pdp-accordion-chevron.open {
          transform: rotate(180deg);
        }
        .pdp-accordion-body {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .pdp-accordion-body.open {
          max-height: 600px;
        }
        .pdp-accordion-content {
          padding: 0 0 16px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #555555;
          line-height: 1.7;
          white-space: pre-line;
        }

        /* ── Sticky CTA bar ── */
        .pdp-cta-bar {
          position: fixed;
          bottom: 65px; /* sit just above mobile nav */
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #E2E2E2;
          display: flex;
          gap: 10px;
          padding: 10px 1.25rem 12px;
          z-index: 350;
        }
        .pdp-add-btn {
          flex: 1;
          padding: 14px;
          background: #0D0D0D;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.15s, transform 0.1s;
        }
        .pdp-add-btn:active { transform: scale(0.98); }
        .pdp-add-btn.feedback { background: #16a34a; }
        .pdp-buy-btn {
          flex: 1;
          padding: 14px;
          background: #ffffff;
          color: #0D0D0D;
          border: 1.5px solid #0D0D0D;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.15s;
        }
        .pdp-buy-btn:hover { background: #F4F4F4; }

        /* ── Size Guide Modal ── */
        .sg-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 600;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
        }
        .sg-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .sg-sheet {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 560px;
          padding: 1.5rem 1.25rem 2rem;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .sg-overlay.open .sg-sheet {
          transform: translateY(0);
        }
        .sg-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .sg-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #0D0D0D;
        }
        .sg-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #0D0D0D;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sg-table {
          width: 100%;
          border-collapse: collapse;
        }
        .sg-table th {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999999;
          padding: 8px 10px;
          text-align: left;
          border-bottom: 1px solid #E2E2E2;
        }
        .sg-table td {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: #0D0D0D;
          padding: 12px 10px;
          border-bottom: 1px solid #F4F4F4;
        }
        .sg-table tr:last-child td { border-bottom: none; }
        .sg-note {
          margin-top: 1rem;
          font-size: 0.78rem;
          color: #999999;
          text-align: center;
        }
      `}</style>

      {/* ── Scrollable Content ── */}
      <div className="pdp-scroll">
        {/* Carousel */}
        <div
          className="pdp-carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="pdp-back-btn pointer" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} weight="bold" />
          </button>

          <div
            className="pdp-carousel-track"
            style={{ transform: `translateX(-${currentImg * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="pdp-carousel-slide">
                <img src={src} alt={`${product.name} ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>

          {/* Dots */}
          {images.length > 1 && (
            <div className="pdp-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`pdp-dot${i === currentImg ? " active" : ""}`}
                  onClick={() => setCurrentImg(i)}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="pdp-card">
          {/* Name + Badges row */}
          <div className="pdp-name-price-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h1 className="pdp-name" style={{ margin: 0 }}>{product.name}</h1>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {(product.discount > 0 || (product.mrp && product.price && product.mrp > product.price)) && (
                  <span className="pdp-discount-badge">
                    {product.discount > 0 ? product.discount : Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="pdp-discount-badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>OUT OF STOCK</span>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <span className="pdp-discount-badge" style={{ background: '#FEF3C7', color: '#D97706' }}>LOW IN STOCK</span>
                )}
              </div>
            </div>
            
            <div className="pdp-price-row" style={{ marginLeft: 0 }}>
              <span className="pdp-sale-price" style={{ fontSize: "1.25rem" }}>Rs. {product.price}</span>
              {product.mrp > product.price && (
                <span className="pdp-original-price" style={{ fontSize: "14px" }}>Rs. {product.mrp}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="pdp-desc">{product.description}</p>

          {/* Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <>
              <p className="pdp-section-label">Select Color</p>
              <div className="pdp-color-row">
                {product.colors.map((hex, i) => (
                  <button
                    key={i}
                    className={`pdp-color-swatch${selectedColor === i ? " selected" : ""}`}
                    style={{ background: hex }}
                    onClick={() => setSelectedColor(i)}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Size Picker */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <div className="pdp-size-header">
                <p className="pdp-section-label" style={{ margin: 0 }}>Select Size</p>
                <button className="pdp-size-guide-btn pointer" onClick={() => setSizeGuideOpen(true)}>
                  Size Guide
                </button>
              </div>
              <div className="pdp-size-row">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`pdp-size-btn${selectedSize === s ? " selected" : ""} pointer`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Accordions */}
          <div className="pdp-accordion-list">
            {ACCORDIONS.map((acc) => (
              <div key={acc.id} className="pdp-accordion-item">
                <button
                  className="pdp-accordion-trigger pointer"
                  onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                >
                  <span>{acc.label}</span>
                  <span className={`pdp-accordion-chevron${openAccordion === acc.id ? " open" : ""}`}>
                    ⌄
                  </span>
                </button>
                <div className={`pdp-accordion-body${openAccordion === acc.id ? " open" : ""}`}>
                  <p className="pdp-accordion-content">{acc.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom spacer for CTA */}
          <div style={{ height: "1.5rem" }} />
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="pdp-cta-bar">
        <button
          className={`pdp-add-btn pointer${addedFeedback ? " feedback" : ""}`}
          onClick={handleAddToBag}
        >
          {addedFeedback ? "✓ Added!" : "Add to Bag"}
        </button>
        <button className="pdp-buy-btn pointer" onClick={handleAddToBag}>
          Buy Now
        </button>
      </div>

      {/* ── Size Guide Bottom Sheet ── */}
      <div className={`sg-overlay${sizeGuideOpen ? " open" : ""}`} onClick={() => setSizeGuideOpen(false)}>
        <div className="sg-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sg-header">
            <span className="sg-title">Size Guide (inches)</span>
            <button className="sg-close pointer" onClick={() => setSizeGuideOpen(false)}>
              <X size={20} weight="bold" />
            </button>
          </div>
          <table className="sg-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Length</th>
                <th>Shoulder</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size}>
                  <td style={{ fontWeight: 700 }}>{row.size}</td>
                  <td>{row.chest}"</td>
                  <td>{row.length}"</td>
                  <td>{row.shoulder}"</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="sg-note">All measurements are approximate. If between sizes, size up.</p>
        </div>
      </div>
    </div>
  );
}
