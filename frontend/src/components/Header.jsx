import React, { useState, useRef, useEffect } from "react";
import { List, MagnifyingGlass, X, User, FolderPlus, ArrowLeft, ShieldCheck } from "@phosphor-icons/react";

export default function Header({
  onSearch,
  searchQuery,
  onMenuClick,
  onProfileClick,
  onAdminClick,
  setActivePage,
  isAdminMode,
  onBack,
  title,
  products = [],
  onProductClick,
  authUser,
  setAuthUser
}) {
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef(null);

  const filteredProducts = searchQuery.trim()
    ? products
        .filter((prod) => {
          const query = searchQuery.toLowerCase();
          return (
            prod.name.toLowerCase().includes(query) ||
            prod.description.toLowerCase().includes(query)
          );
        })
        .slice(0, 3)
    : [];

  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchActive]);

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage("shop");
    }
  };

  const clearSearch = () => {
    onSearch("");
    setSearchActive(false);
  };

  return (
    <header className="glass" style={{
      position: "sticky",
      top: 0,
      width: "100%",
      zIndex: 400,
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      transition: "var(--transition-smooth)"
    }}>
      {searchActive ? (
        <form onSubmit={handleSearchSubmit} style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <MagnifyingGlass size={20} color="var(--color-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search our luxury collection..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-foreground)",
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              fontWeight: 500
            }}
          />
          <button
            type="button"
            onClick={clearSearch}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem"
            }}
          >
            <X size={20} color="var(--color-foreground)" />
          </button>
        </form>
      ) : (
        <>
          {/* Left: Back arrow (product page) OR hamburger */}
          {onBack ? (
            <button
              onClick={onBack}
              className="pointer"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-foreground)",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.95rem",
                marginRight: "0.25rem"
              }}
              aria-label="Go back"
            >
              <ArrowLeft size={22} weight="bold" />
            </button>
          ) : (
            <div className="desktop-only" style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={onMenuClick}
                className="pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-foreground)",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center"
                }}
                aria-label="Menu"
              >
                <List size={26} weight="bold" />
              </button>
            </div>
          )}

          {/* Brand Logo or Centered Title */}
          {title ? (
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--color-foreground)",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap"
            }}>
              {title}
            </div>
          ) : (
            <div
              onClick={() => {
                if (onBack) onBack();
                setActivePage("home");
              }}
              className="pointer no-select"
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "0.25rem"
              }}
            >
              <img
                src="/logo.png"
                alt="Monthrob Logo"
                style={{
                  height: "26px",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </div>
          )}

          {/* Right: Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginLeft: "auto"
          }}>
            {title === "Secure Checkout" ? (
              <div style={{
                color: "var(--color-foreground)",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center"
              }}>
                <ShieldCheck size={24} weight="bold" />
              </div>
            ) : (
              <>
                {/* Search Button */}
                <button
                  onClick={() => setSearchActive(true)}
                  className="pointer"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-foreground)",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                  aria-label="Search"
                >
                  <MagnifyingGlass size={22} />
                </button>

                {/* Desktop-only Profile and Admin */}
                <button
                  onClick={() => authUser ? onProfileClick() : setActivePage("login")}
                  className="pointer desktop-only"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-foreground)",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                  aria-label="Profile"
                >
                  <User size={22} />
                </button>

                {isAdminMode && (
                  <button
                    onClick={onAdminClick}
                    className="pointer desktop-only"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-primary)",
                      padding: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.8rem",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600
                    }}
                    aria-label="Admin Panel"
                  >
                    <FolderPlus size={18} />
                    <span>Admin</span>
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
      {searchActive && searchQuery.trim() && (
        <div className="search-dropdown-overlay">
          <style>{`
            .search-dropdown-overlay {
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: #ffffff;
              border-bottom: 1px solid #EAEAEA;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
              z-index: 500;
              padding: 1.25rem 2rem;
              text-align: left;
            }

            .search-results-header {
              font-family: var(--font-heading);
              font-size: 11px;
              font-weight: 800;
              color: #A1A1AA;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              margin-bottom: 1.25rem;
              border-bottom: 1px solid #F4F4F5;
              padding-bottom: 0.5rem;
            }

            .search-results-list {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .search-result-item {
              display: flex;
              align-items: center;
              gap: 14px;
              cursor: pointer;
              padding: 6px 0;
              transition: transform 0.15s;
            }

            .search-result-item:hover {
              transform: translateX(4px);
            }

            .search-result-thumb {
              width: 52px;
              height: 52px;
              border-radius: 12px;
              object-fit: cover;
              border: 1px solid #F4F4F5;
            }

            .search-result-middle {
              flex: 1;
            }

            .search-result-name {
              font-family: var(--font-heading);
              font-size: 14px;
              font-weight: 800;
              color: #0D0D0D;
            }

            .search-result-collection {
              font-family: var(--font-body);
              font-size: 11px;
              color: #A1A1AA;
              margin-top: 2px;
            }

            .search-result-price {
              font-family: var(--font-heading);
              font-weight: 900;
              font-size: 14px;
              color: #0D0D0D;
            }
          `}</style>
          <div className="search-results-box">
            <div className="search-results-header">
              {filteredProducts.length} {filteredProducts.length === 1 ? "RESULT" : "RESULTS"} FOUND
            </div>
            <div className="search-results-list">
              {filteredProducts.map((prod) => {
                const query = searchQuery.trim();
                const idx = prod.name.toLowerCase().indexOf(query.toLowerCase());
                let titleNode = prod.name;
                if (idx !== -1) {
                  const prefix = prod.name.substring(0, idx);
                  const match = prod.name.substring(idx, idx + query.length);
                  const suffix = prod.name.substring(idx + query.length);
                  titleNode = (
                    <span>
                      {prefix}
                      <span style={{ color: "#EF4444", fontWeight: 800 }}>{match}</span>
                      {suffix}
                    </span>
                  );
                }
                const firstCol = prod.collections?.[0] || "Streetwear";

                return (
                  <div
                    key={prod.id}
                    className="search-result-item"
                    onClick={() => {
                      onProductClick(prod);
                      clearSearch();
                    }}
                  >
                    <img src={prod.image} alt={prod.name} className="search-result-thumb" />
                    <div className="search-result-middle">
                      <div className="search-result-name">{titleNode}</div>
                      <div className="search-result-collection">{firstCol}</div>
                    </div>
                    <div className="search-result-price">Rs. {prod.price}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
