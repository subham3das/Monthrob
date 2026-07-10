import React, { useRef } from "react";
import ProductCard from "./ProductCard";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export default function ProductShowcase({
  collectionName,
  products,
  onAddToCart,
  onProductClick,
  onSeeAllClick
}) {
  const scrollRef = useRef(null);

  // Filter products for this collection (max 10)
  const filteredProducts = (collectionName === "All" || collectionName === "All Products")
    ? products
    : products.filter(p => p.collectionName === collectionName || p.category?.name === collectionName || (p.collections && p.collections.includes(collectionName)));

  const displayProducts = filteredProducts.slice(0, 10);

  // Function to scroll by 2 card widths
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const card = container.querySelector(".showcase-card-wrapper");
    if (!card) return;

    const cardWidth = card.clientWidth + 16; // width + gap
    const scrollAmount = cardWidth * 2; // scroll 2 cards at once

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (displayProducts.length === 0) return null;

  return (
    <div style={{
      padding: "2rem 1.25rem",
      borderBottom: "1px solid var(--color-border)",
      position: "relative",
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <style>{`
        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0;
        }
        .showcase-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          color: #0D0D0D;
          text-transform: capitalize;
        }
        .showcase-scroll-container {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding: 0.5rem 0;
          scrollbar-width: none;
        }
        .showcase-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .showcase-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .showcase-arrow-btn:hover {
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-color: var(--color-primary);
        }
      `}</style>

      {/* Header with Title and See All */}
      <div className="showcase-header">
        <h2 className="showcase-title">{collectionName === "All Products" ? "All" : collectionName}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          
          {/* Scroll Arrows for Desktop */}
          <div className="desktop-only" style={{ display: "flex", gap: "0.5rem", marginRight: "1rem" }}>
            <button onClick={() => scroll("left")} className="showcase-arrow-btn" aria-label="Scroll left">
              <CaretLeft size={20} weight="bold" />
            </button>
            <button onClick={() => scroll("right")} className="showcase-arrow-btn" aria-label="Scroll right">
              <CaretRight size={20} weight="bold" />
            </button>
          </div>

          {/* See All Button */}
          <button
            onClick={() => onSeeAllClick(collectionName)}
            className="btn-secondary pointer"
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700
            }}
          >
            See All
          </button>

        </div>
      </div>

      {/* Horizontal Scroll list of Cards */}
      <div className="showcase-scroll-container" ref={scrollRef}>
        {displayProducts.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={() => onProductClick(product)}
            style={{
              scrollSnapAlign: "start"
            }}
          />
        ))}
      </div>
    </div>
  );
}
