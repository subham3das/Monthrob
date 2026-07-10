import React from "react";
import { X, House, ShoppingBag, ShoppingCart, User, FolderPlus } from "@phosphor-icons/react";

export default function Sidebar({
  isOpen,
  onClose,
  activePage,
  setActivePage,
  onAdminClick,
  onCartClick,
  isAdminMode
}) {
  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(11, 7, 10, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 499,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease"
        }}
      />

      {/* Sidebar drawer */}
      <aside
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "320px",
          height: "100vh",
          zIndex: 500,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "10px 0 30px rgba(0,0,0,0.15)"
        }}
      >
        {/* Close Button Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="Monthrob Logo"
            style={{
              height: "22px",
              objectFit: "contain",
              display: "block"
            }}
          />
          <button
            onClick={onClose}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-foreground)",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center"
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
          <button
            onClick={() => { setActivePage("home"); onClose(); }}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "1.1rem",
              fontWeight: activePage === "home" ? 700 : 500,
              color: activePage === "home" ? "var(--color-primary)" : "var(--color-foreground)",
              textAlign: "left",
              fontFamily: "var(--font-heading)",
              transition: "var(--transition-fast)"
            }}
          >
            <House size={22} weight={activePage === "home" ? "fill" : "regular"} />
            <span>Home</span>
          </button>

          <button
            onClick={() => { setActivePage("shop"); onClose(); }}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "1.1rem",
              fontWeight: activePage === "shop" ? 700 : 500,
              color: activePage === "shop" ? "var(--color-primary)" : "var(--color-foreground)",
              textAlign: "left",
              fontFamily: "var(--font-heading)",
              transition: "var(--transition-fast)"
            }}
          >
            <ShoppingBag size={22} weight={activePage === "shop" ? "fill" : "regular"} />
            <span>Shop Collection</span>
          </button>

          <button
            onClick={() => { onCartClick(); onClose(); }}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--color-foreground)",
              textAlign: "left",
              fontFamily: "var(--font-heading)",
              transition: "var(--transition-fast)"
            }}
          >
            <ShoppingCart size={22} />
            <span>My Cart</span>
          </button>

          <button
            onClick={() => { setActivePage("profile"); onClose(); }}
            className="pointer"
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "1.1rem",
              fontWeight: activePage === "profile" ? 700 : 500,
              color: activePage === "profile" ? "var(--color-primary)" : "var(--color-foreground)",
              textAlign: "left",
              fontFamily: "var(--font-heading)",
              transition: "var(--transition-fast)"
            }}
          >
            <User size={22} weight={activePage === "profile" ? "fill" : "regular"} />
            <span>Profile</span>
          </button>

          {isAdminMode && (
            <>
              <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "1rem 0" }} />
              <button
                onClick={() => { onAdminClick(); onClose(); }}
                className="pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  textAlign: "left",
                  fontFamily: "var(--font-heading)",
                  transition: "var(--transition-fast)"
                }}
              >
                <FolderPlus size={22} />
                <span>Admin Control Panel</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer in Sidebar */}
        <div style={{ marginTop: "auto", fontSize: "0.8rem", color: "gray", textAlign: "center" }}>
          <p>© {new Date().getFullYear()} monthrob.</p>
          <p style={{ marginTop: "0.25rem" }}>Curated Avant-Garde Fashion.</p>
        </div>
      </aside>
    </>
  );
}
