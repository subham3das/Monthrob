import React from "react";
import { Check, Clock, DownloadSimple } from "@phosphor-icons/react";

export default function OrderSuccessPage({
  order = {
    id: "ZG-16830",
    date: "July 9, 2026",
    status: "Placed",
    total: 899,
    items: [
      {
        name: "Mon Jai Edition",
        price: 899,
        quantity: 1,
        color: "rgb(255, 255, 255)"
      }
    ],
    paymentMethod: "Cash on Delivery",
    shippingAddress: "fergergege, gergerg, regregre gergr, egregegreg",
    donation: 0,
    discount: 0
  },
  onContinueShopping
}) {
  // Estimate delivery: 5 days from order date
  const getEstDeliveryDate = () => {
    try {
      const d = new Date(order.createdAt || order.date);
      if (isNaN(d.getTime())) return "July 14, 2026";
      d.setDate(d.getDate() + 5);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return "July 14, 2026";
    }
  };

  const handleDownloadInvoice = () => {
    // Generate simple text-based invoice print
    const receiptElement = document.getElementById("printable-receipt");
    if (receiptElement) {
      const originalTitle = document.title;
      document.title = `Invoice_${order.id}`;
      window.print();
      document.title = originalTitle;
    }
  };

  const subtotal = order.items.reduce((acc, item) => acc + (item.priceAtTime || item.price) * item.quantity, 0);
  const isCOD = order.paymentMethod === "Cash on Delivery";

  return (
    <div className="success-page-root">
      <style>{`
        .success-page-root {
          min-height: 85vh;
          background: #ffffff;
          padding: 2rem 1.25rem 3rem;
          max-width: 520px;
          margin: 0 auto;
          font-family: var(--font-body);
          text-align: center;
        }

        /* ── Top Header ── */
        .success-check-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #0D0D0D;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .success-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 900;
          color: #0D0D0D;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .success-subtitle {
          font-size: 13px;
          color: #71717A;
          margin-bottom: 2rem;
        }

        /* ── Printable Receipt Card ── */
        .receipt-card {
          background: #F8F8F6;
          border: 1px solid #EAEAEA;
          border-radius: 20px;
          padding: 1.75rem 1.5rem;
          margin-bottom: 2rem;
          position: relative;
          text-align: left;
        }

        /* Jagged zig-zag bottom effect */
        .receipt-card::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 8px;
          background-image: linear-gradient(-45deg, transparent 4px, #F8F8F6 4px), linear-gradient(45deg, transparent 4px, #F8F8F6 4px);
          background-size: 8px 8px;
          background-position: left bottom;
          background-repeat: repeat-x;
          filter: drop-shadow(0 1px 0 #EAEAEA);
        }

        .receipt-logo-area {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .receipt-logo-text {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0D0D0D;
        }

        .receipt-logo-red {
          color: #EF4444;
        }

        .receipt-logo-subtitle {
          font-family: var(--font-heading);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #A1A1AA;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .receipt-divider {
          border: none;
          border-top: 1px dashed #E2E2E2;
          margin: 1.25rem 0;
        }

        .receipt-meta-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* Product Rows */
        .receipt-item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          font-size: 13px;
        }

        .receipt-item-left {
          display: flex;
          gap: 6px;
          color: #0D0D0D;
          max-width: 75%;
        }

        .receipt-item-qty {
          color: #A1A1AA;
          font-weight: 700;
        }

        .receipt-item-name {
          font-weight: 800;
          line-height: 1.4;
        }

        .receipt-item-price {
          font-family: var(--font-heading);
          font-weight: 900;
          color: #0D0D0D;
          white-space: nowrap;
        }

        /* Billing Rows */
        .receipt-billing-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #71717A;
          margin-bottom: 0.6rem;
        }

        .receipt-outstanding-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .receipt-outstanding-label {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 900;
          color: #0D0D0D;
          max-width: 65%;
          line-height: 1.2;
        }

        .receipt-outstanding-price {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 950;
          color: #0D0D0D;
          text-align: right;
        }

        /* Delivery Pill */
        .receipt-delivery-pill {
          background: #F0F2EF;
          border-radius: 12px;
          padding: 12px;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #71717A;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
        }

        .receipt-delivery-pill svg {
          color: #71717A;
        }

        /* ── Action Buttons ── */
        .success-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 1rem;
        }

        .btn-invoice {
          background: #ffffff;
          color: #0D0D0D;
          border: 1.5px solid #0D0D0D;
          border-radius: 14px;
          padding: 14px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-invoice:hover {
          background: #F8F8F6;
        }

        .btn-continue {
          background: #0D0D0D;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 14px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .btn-continue:hover {
          opacity: 0.9;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            background: #ffffff;
          }
        }
      `}</style>

      {/* Check Icon and Title */}
      <div className="success-check-circle">
        <Check size={32} weight="bold" />
      </div>
      <h2 className="success-title">Order Placed</h2>
      <p className="success-subtitle">Thank you for choosing monthrob.</p>

      {/* Printable Receipt Block */}
      <div id="printable-receipt" className="receipt-card">
        <div className="receipt-logo-area">
          <div className="receipt-logo-text">
            <span className="receipt-logo-red">mon</span>throb
          </div>
          <div className="receipt-logo-subtitle">Premium Streetwear Receipt</div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-meta-row">
          <span>ID: #{order.shortId || order._id?.slice(-6).toUpperCase() || order.id}</span>
          <span>DATE: {new Date(order.createdAt || order.date).toLocaleDateString()}</span>
        </div>

        <div className="receipt-divider" />

        {/* Product Items */}
        {order.items?.map((item, idx) => (
          <div key={idx} className="receipt-item-row">
            <div className="receipt-item-left">
              <span className="receipt-item-qty">{item.quantity}x</span>
              <span className="receipt-item-name">
                {item.product?.name || item.name}{item.size ? ` (Size: ${item.size})` : ''}{item.color ? ` (Color: ${item.color})` : ''}
              </span>
            </div>
            <span className="receipt-item-price">Rs. {(item.priceAtTime || item.price) * item.quantity}</span>
          </div>
        ))}

        <div className="receipt-divider" />

        {/* Price Breakdown */}
        <div className="receipt-billing-row">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="receipt-billing-row">
          <span>Shipping</span>
          <span>{order.total - subtotal - (order.donation || 0) + (order.discount || 0) <= 0 ? "FREE" : "Rs. 40"}</span>
        </div>
        {order.donation > 0 && (
          <div className="receipt-billing-row">
            <span>Donation</span>
            <span>Rs. {order.donation}</span>
          </div>
        )}
        {order.discount > 0 && (
          <div className="receipt-billing-row" style={{ color: "#EF4444" }}>
            <span>Discount Applied</span>
            <span>- Rs. {order.discount}</span>
          </div>
        )}
        <div className="receipt-billing-row">
          <span>Payment Method</span>
          <span>{order.paymentMethod}</span>
        </div>

        <div className="receipt-outstanding-row">
          <div className="receipt-outstanding-label">
            Total Outstanding {isCOD ? "(COD)" : "(ONLINE)"}
          </div>
          <div className="receipt-outstanding-price">
            Rs. {order.total}
          </div>
        </div>

        {/* Delivery Pill */}
        <div className="receipt-delivery-pill">
          <Clock size={16} weight="bold" />
          <span>Est. Delivery: {getEstDeliveryDate()}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="success-buttons-container">
        <button className="btn-invoice pointer" onClick={handleDownloadInvoice}>
          <DownloadSimple size={16} weight="bold" />
          <span>Download Digital Invoice</span>
        </button>
        <button className="btn-continue pointer" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
