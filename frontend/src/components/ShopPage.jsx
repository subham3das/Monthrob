import React, { useState, useMemo } from "react";
import { Funnel, ArrowsDownUp, X } from "@phosphor-icons/react";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Alphabetical" },
];

// Derive categories from product data — unique values across all products' collections
function getCategories(products) {
  const cats = new Set();
  products.forEach((p) => {
    if (p.category) {
      const catName = typeof p.category === 'object' ? p.category.name : p.category;
      if (catName) cats.add(catName);
    }
  });
  return [...cats];
}

function getCollections(products) {
  const cols = new Set();
  products.forEach((p) => {
    if (p.collectionName) cols.add(p.collectionName);
    if (p.collections && Array.isArray(p.collections)) {
      p.collections.forEach(c => cols.add(c));
    }
  });
  return [...cols].filter(c => c && c !== "All" && c !== "All Products");
}

export default function ShopPage({
  products,
  collections,
  activeCollection,
  setActiveCollection,
  onAddToCart,
  searchQuery,
  onProductClick,
}) {
  const [sortBy, setSortBy] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Normalize: collections may be objects {name,...} or plain strings
  const collectionNames = useMemo(() => getCollections(products), [products]);

  // Pending filter state (only applied when user hits Apply)
  const [pendingCollections, setPendingCollections] = useState(
    activeCollection && activeCollection !== "All" ? [activeCollection] : []
  );
  const [pendingCategories, setPendingCategories] = useState([]);

  // Applied filter state
  const [selectedCollections, setSelectedCollections] = useState(
    activeCollection && activeCollection !== "All" ? [activeCollection] : []
  );
  const [selectedCategories, setSelectedCategories] = useState([]);

  React.useEffect(() => {
    if (activeCollection === "All") {
      setSelectedCollections([]);
      setPendingCollections([]);
    } else if (activeCollection) {
      setSelectedCollections([activeCollection]);
      setPendingCollections([activeCollection]);
    }
  }, [activeCollection]);

  const togglePendingCollection = (col) => {
    setPendingCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const togglePendingCategory = (cat) => {
    setPendingCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const applyFilters = () => {
    setSelectedCollections(pendingCollections);
    setSelectedCategories(pendingCategories);
    setActiveCollection(pendingCollections.length === 1 ? pendingCollections[0] : "All");
    setFilterOpen(false);
  };

  const openFilter = () => {
    // Sync pending with current applied
    setPendingCollections(selectedCollections);
    setPendingCategories(selectedCategories);
    setFilterOpen(true);
    setSortOpen(false);
  };

  const categories = useMemo(() => getCategories(products), [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesCollection =
          selectedCollections.length > 0
            ? selectedCollections.includes(product.collectionName) || 
              (product.collections && product.collections.some((c) => selectedCollections.includes(c)))
            : true;
        const matchesCategory =
          selectedCategories.length > 0
            ? selectedCategories.includes(typeof product.category === 'object' ? product.category.name : product.category)
            : true;
        return matchesSearch && matchesCollection && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCollections, selectedCategories, sortBy, searchQuery]);

  const pageTitle =
    selectedCollections.length > 0
      ? selectedCollections.join(", ").toUpperCase()
      : "ALL PIECES";

  return (
    <div className="shop-page-root">
      <style>{`
        .shop-page-root {
          min-height: 80vh;
          background: #ffffff;
          padding-bottom: 80px;
          position: relative;
          overflow-x: hidden;
        }

        /* ─── Title ─── */
        .shop-page-title {
          font-family: var(--font-heading);
          font-size: clamp(1.8rem, 8vw, 2.25rem);
          font-weight: 900;
          letter-spacing: -0.01em;
          text-align: center;
          padding: 2rem 1rem 1rem;
          color: #0D0D0D;
        }

        /* ─── Controls bar ─── */
        .shop-controls-bar {
          display: flex;
          align-items: center;
          border-top: 1px solid #E2E2E2;
          border-bottom: 1px solid #E2E2E2;
          background: #ffffff;
          position: sticky;
          top: 56px;
          z-index: 100;
        }
        .shop-ctrl-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-right: 1px solid #E2E2E2;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0D0D0D;
          cursor: pointer;
          transition: background 0.15s;
        }
        .shop-ctrl-btn:last-child { border-right: none; }
        .shop-ctrl-btn:hover { background: #F4F4F4; }
        .shop-ctrl-btn.active { background: #0D0D0D; color: #ffffff; }

        /* ─── Sort dropdown ─── */
        .shop-controls-relative { position: relative; }
        .shop-panel-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: transparent;
        }
        .shop-dropdown-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 1px solid #E2E2E2;
          padding: 1.25rem 1rem;
          z-index: 201;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .shop-sort-options { display: flex; flex-direction: column; gap: 0; }
        .shop-sort-opt {
          padding: 12px 4px;
          border: none;
          background: transparent;
          text-align: left;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #0D0D0D;
          border-bottom: 1px solid #F4F4F4;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .shop-sort-opt:last-child { border-bottom: none; }
        .shop-sort-opt.active { font-weight: 700; }
        .shop-sort-opt.active::after { content: "✓"; color: #0D0D0D; }

        /* ─── Filter Drawer ─── */
        .filter-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 500;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .filter-drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .filter-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(82vw, 300px);
          background: #F8F8F8;
          z-index: 501;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.32s cubic-bezier(0.25, 1, 0.5, 1);
          overflow: hidden;
        }
        .filter-drawer.open {
          transform: translateX(0);
        }
        .filter-drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.25rem 0;
        }
        .filter-drawer-breadcrumb {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999999;
          margin-bottom: 6px;
        }
        .filter-drawer-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 900;
          color: #0D0D0D;
          letter-spacing: -0.01em;
        }
        .filter-drawer-close {
          background: transparent;
          border: none;
          color: #0D0D0D;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }
        .filter-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .filter-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .filter-section-title {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0D0D0D;
        }
        .filter-reset-link {
          font-family: var(--font-body);
          font-size: 12px;
          color: #999999;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .filter-checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .filter-checkbox-item {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .filter-checkbox-box {
          width: 18px;
          height: 18px;
          border: 1.5px solid #C4C4C4;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .filter-checkbox-box.checked {
          background: #0D0D0D;
          border-color: #0D0D0D;
        }
        .filter-checkbox-box.checked::after {
          content: "";
          width: 10px;
          height: 6px;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(-45deg) translateY(-1px);
        }
        .filter-checkbox-label {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #0D0D0D;
        }
        .filter-drawer-footer {
          padding: 1rem 1.25rem 1.5rem;
          border-top: 1px solid #E2E2E2;
        }
        .filter-apply-btn {
          width: 100%;
          padding: 15px;
          background: #0D0D0D;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s;
        }
        .filter-apply-btn:hover { background: #27272A; }

        /* ─── Products Grid ─── */
        .shop-grid-wrapper { padding: 16px 10px; }
        .shop-products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .shop-products-grid .product-card {
          width: 100% !important;
          min-width: 0 !important;
          flex-shrink: unset !important;
          scroll-snap-align: unset !important;
        }

        /* ─── Empty State ─── */
        .shop-empty { text-align: center; padding: 4rem 2rem; color: #71717a; }
        .shop-empty h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: #0D0D0D;
          margin-bottom: 0.5rem;
        }
        .shop-reset-btn {
          margin-top: 1rem;
          padding: 10px 24px;
          background: #0D0D0D;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          letter-spacing: 0.05em;
        }

        /* ─── Results count ─── */
        .shop-results-count {
          font-family: var(--font-body);
          font-size: 11px;
          color: #999999;
          letter-spacing: 0.04em;
          text-align: center;
          padding: 0.5rem 1rem 0;
        }
      `}</style>

      {/* ─── Filter Drawer ─── */}
      <div
        className={`filter-drawer-overlay${filterOpen ? " open" : ""}`}
        onClick={() => setFilterOpen(false)}
      />
      <div className={`filter-drawer${filterOpen ? " open" : ""}`}>
        {/* Header */}
        <div className="filter-drawer-header">
          <div>
            <p className="filter-drawer-breadcrumb">HOME &gt; ALL PIECES</p>
            <h2 className="filter-drawer-title">ALL PIECES</h2>
          </div>
          <button className="filter-drawer-close pointer" onClick={() => setFilterOpen(false)}>
            <X size={22} weight="bold" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="filter-drawer-body">
          {/* COLLECTION */}
          <div>
            <div className="filter-section-header">
              <span className="filter-section-title">Collection</span>
              <button
                className="filter-reset-link"
                onClick={() => setPendingCollections([])}
              >
                Reset
              </button>
            </div>
            <div className="filter-checkbox-list">
              {collectionNames.map((colName) => (
                  <label key={colName} className="filter-checkbox-item pointer">
                    <span
                      className={`filter-checkbox-box${pendingCollections.includes(colName) ? " checked" : ""}`}
                      onClick={() => togglePendingCollection(colName)}
                    />
                    <span
                      className="filter-checkbox-label"
                      onClick={() => togglePendingCollection(colName)}
                    >
                      {colName}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          {/* CATEGORY */}
          {categories.length > 0 && (
            <div>
              <div className="filter-section-header">
                <span className="filter-section-title">Category</span>
                <button
                  className="filter-reset-link"
                  onClick={() => setPendingCategories([])}
                >
                  Reset
                </button>
              </div>
              <div className="filter-checkbox-list">
                {categories.map((cat) => (
                  <label key={cat} className="filter-checkbox-item pointer">
                    <span
                      className={`filter-checkbox-box${pendingCategories.includes(cat) ? " checked" : ""}`}
                      onClick={() => togglePendingCategory(cat)}
                    />
                    <span
                      className="filter-checkbox-label"
                      onClick={() => togglePendingCategory(cat)}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="filter-drawer-footer">
          <button className="filter-apply-btn pointer" onClick={applyFilters}>
            ✓ Apply
          </button>
        </div>
      </div>

      {/* ─── Page Title ─── */}
      <h1 className="shop-page-title">{pageTitle}</h1>

      {/* ─── Controls Bar ─── */}
      <div className="shop-controls-relative">
        <div className="shop-controls-bar">
          <button
            className={`shop-ctrl-btn${filterOpen ? " active" : ""}`}
            onClick={openFilter}
          >
            <Funnel size={14} weight="bold" />
            FILTER
          </button>
          <button
            className={`shop-ctrl-btn${sortOpen ? " active" : ""}`}
            onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
          >
            <ArrowsDownUp size={14} weight="bold" />
            SORT
          </button>

        </div>

        {/* Sort dropdown */}
        {sortOpen && (
          <>
            <div className="shop-panel-overlay" onClick={() => setSortOpen(false)} />
            <div className="shop-dropdown-panel" style={{ zIndex: 202 }}>
              <div className="shop-sort-options">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`shop-sort-opt${sortBy === opt.value ? " active" : ""}`}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Results Count */}
      <p className="shop-results-count">
        {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      {/* ─── Products Grid ─── */}
      <div className="shop-grid-wrapper">
        {filteredProducts.length === 0 ? (
          <div className="shop-empty">
            <h3>No items found</h3>
            <p>Try adjusting your filters or search.</p>
            <button
              className="shop-reset-btn"
              onClick={() => {
                setSelectedCollections([]);
                setSelectedCategories([]);
                setActiveCollection("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="shop-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
