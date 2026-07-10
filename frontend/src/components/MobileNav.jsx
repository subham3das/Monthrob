import React from "react";
import { House, ShoppingBag, ShoppingCart, User, FolderPlus } from "@phosphor-icons/react";

export default function MobileNav({
  activePage,
  setActivePage,
  cartCount,
  onCartClick,
  onAdminClick,
  isAdminMode,
  authUser
}) {
  return (
    <div
      className="mobile-only glass"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "65px",
        zIndex: 400,
        display: "grid",
        gridTemplateColumns: isAdminMode ? "1fr 1fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
        alignItems: "center",
        justifyItems: "center",
        borderTop: "1px solid var(--color-border)",
        paddingBottom: "env(safe-area-inset-bottom)" // iOS Safe Area support
      }}
    >
      {/* Home Button */}
      <button
        onClick={() => setActivePage("home")}
        className="pointer"
        style={{
          background: "transparent",
          border: "none",
          color: activePage === "home" ? "var(--color-primary)" : "var(--color-foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          fontSize: "0.7rem",
          fontWeight: activePage === "home" ? 700 : 500,
          fontFamily: "var(--font-heading)"
        }}
      >
        <House size={22} weight={activePage === "home" ? "fill" : "regular"} />
        <span>Home</span>
      </button>

      {/* Shop Button */}
      <button
        onClick={() => setActivePage("shop")}
        className="pointer"
        style={{
          background: "transparent",
          border: "none",
          color: activePage === "shop" ? "var(--color-primary)" : "var(--color-foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          fontSize: "0.7rem",
          fontWeight: activePage === "shop" ? 700 : 500,
          fontFamily: "var(--font-heading)"
        }}
      >
        <ShoppingBag size={22} weight={activePage === "shop" ? "fill" : "regular"} />
        <span>Shop</span>
      </button>

      {/* Cart Button */}
      <button
        onClick={onCartClick}
        className="pointer"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          fontSize: "0.7rem",
          fontFamily: "var(--font-heading)",
          position: "relative"
        }}
      >
        <div style={{ position: "relative" }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              fontSize: "0.65rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* Profile Button */}
      <button
        onClick={() => authUser ? setActivePage("profile") : setActivePage("login")}
        className="pointer"
        style={{
          background: "transparent",
          border: "none",
          color: activePage === "profile" ? "var(--color-primary)" : "var(--color-foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          fontSize: "0.7rem",
          fontWeight: activePage === "profile" ? 700 : 500,
          fontFamily: "var(--font-heading)"
        }}
      >
        <User size={22} weight={activePage === "profile" ? "fill" : "regular"} />
        <span>Profile</span>
      </button>

      {/* Admin Button */}
      {isAdminMode && (
        <button
          onClick={onAdminClick}
          className="pointer"
          style={{
            background: "transparent",
            border: "none",
            color: activePage === "admin" ? "var(--color-primary)" : "var(--color-foreground)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            fontSize: "0.7rem",
            fontWeight: activePage === "admin" ? 700 : 500,
            fontFamily: "var(--font-heading)"
          }}
        >
          <FolderPlus size={22} weight={activePage === "admin" ? "fill" : "regular"} />
          <span>Admin</span>
        </button>
      )}
    </div>
  );
}

