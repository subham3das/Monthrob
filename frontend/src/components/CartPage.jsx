import React from "react";
import { X, Trash, Plus, Minus } from "@phosphor-icons/react";

export default function CartPage({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
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

      {/* Drawer */}
      <div
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(400px, 100%)",
          height: "100vh",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800 }}>
            SHOPPING CART ({cartItems.length})
          </h2>
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

        {/* Cart list */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              textAlign: "center",
              opacity: 0.7
            }}>
              <p style={{ fontSize: "1.1rem" }}>Your cart is empty.</p>
              <button onClick={onClose} className="btn-primary pointer">Continue Shopping</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id || item.id} style={{
                display: "flex",
                gap: "1rem",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "1rem"
              }}>
                {/* Product Image */}
                <img
                  src={item.images?.[0] || item.image}
                  alt={item.name}
                  style={{
                    width: "80px",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                {/* Product Details */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "left"
                }}>
                  <div>
                    <h4 style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--color-foreground)"
                    }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>Rs. {item.price}</span>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.2)"
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item._id || item.id, item.quantity - 1)}
                        className="pointer"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "0.25rem 0.5rem",
                          display: "flex",
                          alignItems: "center",
                          color: "var(--color-foreground)"
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: "0 0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item._id || item.id, item.quantity + 1)}
                        className="pointer"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "0.25rem 0.5rem",
                          display: "flex",
                          alignItems: "center",
                          color: "var(--color-foreground)"
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item._id || item.id)}
                      className="pointer"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--color-destructive)",
                        padding: "0.25rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                      title="Remove Item"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area */}
        {cartItems.length > 0 && (
          <div style={{
            padding: "1.5rem",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline"
            }}>
              <span style={{ fontSize: "1rem", fontWeight: 600 }}>Subtotal</span>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--color-foreground)"
              }}>
                Rs. {totalPrice}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, textAlign: "left" }}>
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={onCheckout}
              className="btn-primary pointer"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "1rem"
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
