import React, { useState } from "react";
import { applyCoupon, createPaymentOrder, verifyPayment } from "../api";
import {
  MapPin,
  ShoppingBag,
  Tag,
  CreditCard,
  Plus,
  Sparkle,
  ChatCircleText,
  ArrowRight,
  X
} from "@phosphor-icons/react";

export default function CheckoutPage({
  cartItems = [],
  userProfile = { name: "Subham Das", phone: "09954060000" },
  authUser,
  onPlaceOrder,
  onLoginRequired,
  addresses = [],
  setAddresses
}) {
  const [selectedPayment, setSelectedPayment] = useState("online"); // online or cod
  const [donationAmount, setDonationAmount] = useState("");
  const [appliedDonation, setAppliedDonation] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { discount, couponId }
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (streetAddress.trim() && city.trim() && zipCode.trim()) {
      const fullAddr = `${streetAddress.trim()}, ${city.trim()}, ${state.trim()} ${zipCode.trim()}, ${country.trim()}`;
      const newAddr = {
        id: Date.now(),
        name: userProfile?.name || (userProfile?.email ? userProfile.email.split('@')[0] : "Guest"),
        tag: addressLabel.trim() || "Home",
        addressLine: fullAddr,
        phone: `${phoneCountry}${phoneNumber}`,
        email: email || userProfile?.email || ""
      };
      setAddresses([newAddr, ...addresses]);
      // Reset form fields
      setAddressLabel("");
      setStreetAddress("");
      setCity("");
      setState("");
      setZipCode("");
      setCountry("");
      setEmail("");
      setPhoneNumber("");
      setIsDefault(false);
      setShowAddressModal(false);
    }
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 40 : 0;
  const promoDiscount = appliedPromo?.discount || 0;
  const grandTotal = subtotal + shippingFee + appliedDonation - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const userId = userProfile?._id || userProfile?.id || null;
      const { data } = await applyCoupon(promoCode.trim(), userId, subtotal);
      setAppliedPromo(data);
    } catch (err) {
      setPromoError(err?.response?.data?.message || 'Invalid coupon');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleAddDonation = () => {
    const val = parseFloat(donationAmount);
    if (!isNaN(val) && val > 0) {
      setAppliedDonation(val);
      setDonationAmount("");
    }
  };

  const handlePlaceOrderSubmit = async () => {
    if (!authUser) { onLoginRequired?.(); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    if (addresses.length === 0) { alert("Please add a shipping address before placing the order."); return; }

    const orderData = {
      items: cartItems,
      shippingAddress: addresses[0] || { addressLine: "No shipping address selected" },
      paymentMethod: selectedPayment === "online" ? "Online Payment" : "Cash on Delivery",
      donation: appliedDonation,
      discount: promoDiscount,
      couponId: appliedPromo?.couponId || null,
      total: grandTotal
    };

    if (selectedPayment === "online") {
      try {
        const { data: order } = await createPaymentOrder(grandTotal);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TBhnTQRSPw6ZN8",
          amount: order.amount,
          currency: order.currency,
          name: "Monthrob Store",
          description: "Order Payment",
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyRes = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                // Submit actual order
                onPlaceOrder({ ...orderData, paymentId: response.razorpay_payment_id });
              } else {
                alert("Payment verification failed");
              }
            } catch (err) {
              console.error(err);
              alert("Payment verification error");
            }
          },
          prefill: {
            name: userProfile?.name || "Guest",
            email: userProfile?.email || "",
            contact: userProfile?.phone || ""
          },
          theme: {
            color: "#0F0F0F"
          }
        };

        if (window.Razorpay) {
          const rzp1 = new window.Razorpay(options);
          rzp1.on('payment.failed', function (response){
            alert(response.error.description);
          });
          rzp1.open();
        } else {
          alert("Razorpay SDK failed to load. Are you connected to the internet?");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to create Razorpay order");
      }
    } else {
      onPlaceOrder(orderData);
    }
  };

  return (
    <div className="checkout-page-root">
      <style>{`
        .checkout-page-root {
          min-height: 80vh;
          background: #ffffff;
          padding: 0.75rem 1.25rem 1.5rem;
          max-width: 600px;
          margin: 0 auto;
          font-family: var(--font-body);
        }


        /* ── Cards Common Style ── */
        .checkout-card {
          background: #F8F8F6;
          border: 1px solid #EAEAEA;
          border-radius: 20px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
        }

        .card-header-icon {
          color: #0D0D0D;
          display: flex;
          align-items: center;
        }

        .card-header-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 900;
          color: #0D0D0D;
        }

        /* ── Shipping Address ── */
        .address-box {
          background: #FFFFFF;
          border: 1.5px solid #0d0d0d;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
        }

        .address-name {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #0D0D0D;
          margin-bottom: 4px;
        }

        .address-line {
          font-size: 12px;
          color: #71717A;
          line-height: 1.5;
        }

        .address-chat-icon {
          color: #0D0D0D;
          cursor: pointer;
        }

        .add-address-btn {
          width: 100%;
          border: 1.5px dashed #E2E2E2;
          background: transparent;
          border-radius: 16px;
          padding: 12px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: #0D0D0D;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .add-address-btn:hover {
          border-color: #0D0D0D;
        }

        /* ── Order Summary ── */
        .summary-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-item-img {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
          background: #EAEAEA;
          flex-shrink: 0;
        }

        .summary-item-details {
          flex: 1;
        }

        .summary-item-name {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #0D0D0D;
          margin-bottom: 3px;
        }

        .summary-item-meta {
          font-size: 11px;
          color: #71717A;
          margin-bottom: 6px;
        }

        .summary-item-qty {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: #0D0D0D;
        }

        .summary-item-price {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 900;
          color: #0D0D0D;
        }

        /* ── The Collective Jar ── */
        .jar-card {
          background: #0D0D0D;
          color: #ffffff;
        }

        .jar-card .card-header-icon,
        .jar-card .card-header-title {
          color: #ffffff;
        }

        .jar-desc {
          font-size: 12px;
          color: #A1A1AA;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .jar-input-row {
          display: flex;
          gap: 10px;
          margin-bottom: 1.25rem;
        }

        .jar-input {
          flex: 1;
          background: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0D0D0D;
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
        }

        .jar-add-btn {
          background: #ffffff;
          color: #0D0D0D;
          border: none;
          border-radius: 12px;
          padding: 0 20px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .jar-progress-container {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .jar-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #A8D5BA, #FFFFFF);
          transition: width 0.3s;
        }

        .jar-progress-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-heading);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #FFFFFF;
        }

        /* ── Promo Code ── */
        .promo-input-row {
          display: flex;
          gap: 10px;
        }

        .promo-input {
          flex: 1;
          background: #ffffff;
          border: 1px solid #E2E2E2;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0D0D0D;
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
        }

        .promo-apply-btn {
          background: #0d0d0d;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0 20px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .promo-status {
          font-size: 12px;
          margin-top: 6px;
          font-weight: 700;
        }

        /* ── Payment Method Grid ── */
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .payment-option-card {
          background: #F8F8F6;
          border: 1.5px solid #EAEAEA;
          border-radius: 16px;
          padding: 1.25rem 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.15s, background-color 0.15s;
          text-align: center;
        }

        .payment-option-card.active {
          border-color: #0D0D0D;
          background: #FFFFFF;
        }

        .payment-option-icon {
          color: #0D0D0D;
        }

        .payment-option-label {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #0D0D0D;
          text-transform: uppercase;
        }

        /* ── Billing Summary List ── */
        .billing-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1.5px dashed #E2E2E2;
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .billing-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #71717A;
        }

        .grand-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .grand-total-label {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 900;
          color: #0D0D0D;
        }

        .grand-total-val {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 900;
          color: #0D0D0D;
        }

        .place-order-submit-btn {
          width: 100%;
          background: #0d0d0d;
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 16px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .place-order-submit-btn:hover {
          opacity: 0.95;
        }

        /* ── Simple Address Popup Modal ── */
        .address-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 600;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .address-modal-sheet {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 560px;
          padding: 1.5rem 1.25rem 2rem;
          text-align: left;
        }
        .address-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        /* Form elements styling */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
          width: 100%;
        }
        .form-label {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          color: #0D0D0D;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E2E2E2;
          background: #F8F8F6;
          color: #0D0D0D;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #0D0D0D;
          background: #ffffff;
        }
        
        .pe-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #0D0D0D;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* ── 1. SHIPPING ADDRESS CARD ── */}
      <div className="checkout-card">
        <div className="card-header-row">
          <span className="card-header-icon"><MapPin size={20} weight="bold" /></span>
          <span className="card-header-title">Shipping Address</span>
        </div>

        {addresses.map((addr) => (
          <div key={addr.id} className="address-box">
            <div>
              <div className="address-name">{addr.name} ({addr.tag})</div>
              <div className="address-line">{addr.addressLine}</div>
              {addr.phone && <div className="address-line" style={{ fontSize: '11px', color: '#71717A' }}>{addr.phone}</div>}
            </div>
            <span className="address-chat-icon"><ChatCircleText size={18} weight="bold" /></span>
          </div>
        ))}

        <button className="add-address-btn" onClick={() => setShowAddressModal(true)}>
          <Plus size={14} weight="bold" />
          <span>Add/Manage Addresses</span>
        </button>
      </div>

      {/* ── 2. ORDER SUMMARY CARD ── */}
      <div className="checkout-card">
        <div className="card-header-row">
          <span className="card-header-icon"><ShoppingBag size={20} weight="bold" /></span>
          <span className="card-header-title">Order Summary</span>
        </div>

        {cartItems.map((item, idx) => (
          <div key={idx} className="summary-item-row" style={{ marginBottom: idx < cartItems.length - 1 ? "1rem" : 0 }}>
            <img src={item.images?.[0] || item.image} alt={item.name} className="summary-item-img" />
            <div className="summary-item-details">
              <h4 className="summary-item-name">{item.name}</h4>
              <p className="summary-item-meta">{item.selectedSize ? `Size: ${item.selectedSize}` : ''}{item.selectedSize && item.selectedColor ? ' | ' : ''}{item.selectedColor ? `Color: ${item.selectedColor}` : ''}</p>
              <div className="summary-item-qty">Qty: {item.quantity}</div>
            </div>
            <span className="summary-item-price">Rs. {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* ── 3. THE COLLECTIVE JAR CARD (BLACK BACKGROUND) ── */}
      <div className="checkout-card jar-card">
        <div className="card-header-row">
          <span className="card-header-icon"><Sparkle size={20} weight="bold" /></span>
          <span className="card-header-title">The Collective Jar</span>
        </div>
        <p className="jar-desc">
          Your contribution transcends style. 100% of these proceeds go directly to supporting underprivileged communities in our seasonal outreach. Together, we define impact.
        </p>
        <div className="jar-input-row">
          <input
            type="number"
            className="jar-input"
            placeholder="Add a Donation (Rs.)"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <button className="jar-add-btn" onClick={handleAddDonation}>Add</button>
        </div>
        <div className="jar-progress-container">
          <div
            className="jar-progress-fill"
            style={{ width: appliedDonation > 0 ? "40%" : "20%" }}
          />
        </div>
        <div className="jar-progress-footer">
          <span>COMMUNITY IMPACT</span>
          <span>RS. {appliedDonation} CONTRIBUTING</span>
        </div>
      </div>

      {/* ── 4. PROMO CODE CARD ── */}
      <div className="checkout-card">
        <div className="card-header-row">
          <span className="card-header-icon"><Tag size={20} weight="bold" /></span>
          <span className="card-header-title">Promo Code</span>
        </div>
        <div className="promo-input-row">
          <input
            type="text"
            className="promo-input"
            placeholder="Enter coupon code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            disabled={!!appliedPromo}
          />
          {appliedPromo ? (
            <button className="promo-apply-btn" style={{ background: '#EF4444' }} onClick={() => { setAppliedPromo(null); setPromoCode(''); }}>Remove</button>
          ) : (
            <button className="promo-apply-btn" onClick={handleApplyPromo} disabled={promoLoading}>{promoLoading ? '...' : 'Apply'}</button>
          )}
        </div>
        {appliedPromo && (
          <div className="promo-status" style={{ color: "#10B981" }}>
            ✓ Coupon applied: Rs. {promoDiscount} off
          </div>
        )}
        {promoError && (
          <div className="promo-status" style={{ color: "#EF4444" }}>
            {promoError}
          </div>
        )}
      </div>

      {/* ── 5. PAYMENT METHOD CARD ── */}
      <div className="checkout-card">
        <div className="card-header-row">
          <span className="card-header-icon"><CreditCard size={20} weight="bold" /></span>
          <span className="card-header-title">Payment Method</span>
        </div>
        <div className="payment-grid">
          <div
            className={`payment-option-card${selectedPayment === "online" ? " active" : ""}`}
            onClick={() => setSelectedPayment("online")}
          >
            <CreditCard size={24} weight="bold" className="payment-option-icon" />
            <span className="payment-option-label">Online</span>
          </div>
          <div
            className={`payment-option-card${selectedPayment === "cod" ? " active" : ""}`}
            onClick={() => setSelectedPayment("cod")}
          >
            <ShoppingBag size={24} weight="bold" className="payment-option-icon" />
            <span className="payment-option-label">COD</span>
          </div>
        </div>
      </div>

      {/* ── 6. BILLING SUMMARY & SUBMIT CARD ── */}
      <div className="checkout-card">
        <div className="billing-list">
          <div className="billing-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="billing-row">
            <span>Shipping Fee</span>
            <span>Rs. {shippingFee}</span>
          </div>
          <div className="billing-row">
            <span>Donation</span>
            <span>Rs. {appliedDonation}</span>
          </div>
          {appliedPromo && (
            <div className="billing-row" style={{ color: "#10B981" }}>
              <span>Promo Discount</span>
              <span>- Rs. {promoDiscount}</span>
            </div>
          )}
        </div>
        <div className="grand-total-row">
          <span className="grand-total-label">Grand Total</span>
          <span className="grand-total-val">Rs. {grandTotal}</span>
        </div>
        <button className="place-order-submit-btn" onClick={handlePlaceOrderSubmit}>
          <span>Place Order</span>
          <ArrowRight size={16} weight="bold" />
        </button>
      </div>



      {/* ── ADDRESS MODAL POPUP ── */}
      {showAddressModal && (
        <div className="address-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="address-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <span className="pe-title">Add New Address</span>
              <button className="pe-close pointer" onClick={() => setShowAddressModal(false)}>
                <X size={20} weight="bold" />
              </button>
            </div>
            <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Address Label */}
              <div className="form-group">
                <label className="form-label">Address Label (e.g. Home, Office)</label>
                <input
                  type="text"
                  className="form-input"
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  placeholder="Home"
                />
              </div>

              {/* Street Address */}
              <div className="form-group">
                <label className="form-label">Street Address <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace"
                  required
                />
              </div>

              {/* City & State (2 columns) */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">City <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">State <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="OR"
                    required
                  />
                </div>
              </div>

              {/* Zip Code & Country (2 columns) */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Zip Code <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="97403"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Country <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="USA"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. subham@example.com"
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">Phone Number <span style={{ color: "#EF4444" }}>*</span></label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select
                    className="form-input"
                    style={{ width: "100px", paddingRight: "8px" }}
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                  >
                    <option value="+91">IN +91</option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                  </select>
                  <input
                    type="tel"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="10 Digit Number..."
                    required
                  />
                </div>
              </div>

              {/* Default Checkbox */}
              <label className="pointer" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#71717A", marginTop: "0.25rem" }}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#0D0D0D" }}
                />
                <span>Set as default address</span>
              </label>

              <button type="submit" className="place-order-submit-btn" style={{ marginTop: "0.5rem" }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
