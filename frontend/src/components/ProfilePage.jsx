import React, { useState } from "react";
import {
  PencilSimple,
  CaretRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  SignOut,
  Clock,
  ArrowSquareOut,
  X
} from "@phosphor-icons/react";

export default function ProfilePage({
  orders = [],
  setOrders,
  profileView = "dashboard",
  setProfileView,
  trackingOrder,
  setTrackingOrder,
  userProfile,
  setUserProfile,
  addresses = [],
  setAddresses,
  setCartItems,
  setActivePage,
  setAuthUser
}) {
  const [activeOrderTab, setActiveOrderTab] = useState("ongoing"); // ongoing vs history
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || "");
  const [editPhone, setEditPhone] = useState(userProfile?.phone || "");

  // Manager State Hooks
  const [addressManagerOpen, setAddressManagerOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [paymentManagerOpen, setPaymentManagerOpen] = useState(false);

  // Add Address Form States
  const [addressLabel, setAddressLabel] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (streetAddress.trim() && city.trim() && zipCode.trim()) {
      const fullAddr = `${streetAddress.trim()}, ${city.trim()}, ${state.trim()} ${zipCode.trim()}, ${country.trim()}`;
      setAddresses([
        ...addresses,
        {
          id: Date.now(),
          name: userProfile?.name || (userProfile?.email ? userProfile.email.split('@')[0] : "Guest"),
          tag: addressLabel.trim() || "Home",
          addressLine: fullAddr
        }
      ]);
      // Reset fields
      setAddressLabel("");
      setStreetAddress("");
      setCity("");
      setState("");
      setZipCode("");
      setCountry("");
      setEmail("");
      setPhoneNumber("");
      setAddAddressOpen(false);
    }
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length <= 1) {
      alert("You must keep at least one address.");
      return;
    }
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setUserProfile(null);
      setCartItems([]);
      localStorage.removeItem("monthrob_cart");
      localStorage.removeItem("monthrob_auth");
      if (setAuthUser) setAuthUser(null);
      setActivePage("login");
    }
  };

  const handleOpenEdit = () => {
    setEditName(userProfile?.name || "");
    setEditPhone(userProfile?.phone || "");
    setEditProfileOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (editName.trim() && editPhone.trim()) {
      setUserProfile({
        name: editName.trim(),
        phone: editPhone.trim()
      });
      setEditProfileOpen(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Cancel this order?")) {
      const updated = orders.map((o) =>
        (o._id || o.id) === orderId ? { ...o, status: "Cancelled" } : o
      );
      setOrders(updated);
      if (trackingOrder && (trackingOrder._id || trackingOrder.id) === orderId) {
        setTrackingOrder({ ...trackingOrder, status: "Cancelled" });
      }
    }
  };

  // Find first ongoing order for Dashboard widget
  const ongoingOrder = orders.find(
    (o) =>
      o.status === "Placed" ||
      o.status === "Confirmed" ||
      o.status === "Shipped"
  );

  // Find most recent order for Dashboard widget
  const pastOrder = orders.length > 0 ? orders[0] : null;

  // Filter orders for My Orders page
  const filteredOrders = orders.filter((o) => {
    const isOngoing =
      o.status === "Placed" ||
      o.status === "Confirmed" ||
      o.status === "Shipped";
    return activeOrderTab === "ongoing" ? isOngoing : !isOngoing;
  });

  return (
    <div className="profile-page-root">
      <style>{`
        .profile-page-root {
          min-height: 80vh;
          background: #ffffff;
          padding: 0.75rem 1.25rem 1.5rem;
          max-width: 600px;
          margin: 0 auto;
          font-family: var(--font-body);
        }

        /* ── Header / Avatar ── */
        .profile-header-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 1.25rem;
        }
        .avatar-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 0.75rem;
        }
        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #F4F4F4;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E2E2E2;
          overflow: hidden;
        }
        .avatar-circle svg {
          width: 60px;
          height: 60px;
          color: #A1A1AA;
        }
        .avatar-edit-btn {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0D0D0D;
          border: 1.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
        }
        .profile-user-name {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 900;
          color: #0D0D0D;
          margin-bottom: 2px;
        }
        .profile-user-phone {
          font-size: 0.9rem;
          color: #71717A;
          letter-spacing: 0.02em;
        }

        /* ── Section Titles ── */
        .profile-section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1.25rem 0 0.6rem;
        }
        .profile-section-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 900;
          color: #0D0D0D;
        }
        .profile-section-icon {
          color: #A1A1AA;
        }

        /* ── Cards ── */
        .profile-gray-card {
          background: #F8F8F6;
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid #EAEAEA;
        }

        /* Stepper */
        .order-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .order-id-label {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          color: #71717A;
        }
        .order-product-name {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 850;
          color: #0D0D0D;
          margin-top: 2px;
        }
        .order-status-badge {
          background: #0D0D0D;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .stepper-bar-container {
          position: relative;
          padding: 0 10px;
          margin-bottom: 1.5rem;
        }
        .stepper-track-line {
          position: absolute;
          top: 10px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: #E4E4E7;
          z-index: 1;
        }
        .stepper-track-fill {
          position: absolute;
          top: 10px;
          left: 16px;
          height: 2px;
          background: #0D0D0D;
          z-index: 2;
          transition: width 0.3s;
        }
        .stepper-nodes-row {
          position: relative;
          display: flex;
          justify-content: space-between;
          z-index: 3;
        }
        .stepper-node-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
        }
        .stepper-dot {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          position: relative;
        }
        .stepper-dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E4E4E7;
          border: 2px solid #E4E4E7;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .stepper-dot.active .stepper-dot-inner {
          width: 14px;
          height: 14px;
          background: #0D0D0D;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 0 2px #0D0D0D;
        }
        .stepper-dot.completed .stepper-dot-inner {
          background: #0D0D0D;
          border-color: #0D0D0D;
        }
        .stepper-node-label {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 700;
          color: #A1A1AA;
          text-align: center;
        }
        .stepper-node-label.active {
          color: #0D0D0D;
          font-weight: 800;
        }
        .stepper-node-label.completed {
          color: #71717A;
        }
        .stepper-buttons-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .cancel-order-btn {
          background: #ffffff;
          color: #EF4444;
          border: 1px solid #FEE2E2;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cancel-order-btn:hover {
          background: #FEF2F2;
        }
        .track-external-btn {
          background: #0d0d0d;
          color: #ffffff;
          border: none;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .track-external-btn:hover {
          opacity: 0.9;
        }

        /* Recent Order Item */
        .recent-order-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8F8F6;
          border-radius: 20px;
          padding: 1rem;
          border: 1px solid #EAEAEA;
          cursor: pointer;
          transition: background 0.15s;
        }
        .recent-order-box:hover {
          background: #F2F2EF;
        }
        .recent-order-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .recent-order-img-container {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          background: #F4F4F4;
          flex-shrink: 0;
        }
        .recent-order-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .recent-order-title {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #0D0D0D;
          margin-bottom: 3px;
        }
        .recent-order-status-info {
          font-size: 11px;
          color: #71717A;
        }
        .recent-order-chevron {
          color: #A1A1AA;
        }

        /* ── Account Settings List ── */
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .settings-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8F8F6;
          border: 1px solid #EAEAEA;
          border-radius: 16px;
          padding: 14px 18px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .settings-item-btn:hover {
          background: #F2F2EF;
        }
        .settings-item-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .settings-item-icon {
          color: #0D0D0D;
          display: flex;
          align-items: center;
        }
        .settings-item-label {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #0D0D0D;
        }
        .settings-item-chevron {
          color: #A1A1AA;
        }

        /* Special Logout Item */
        .settings-item-btn.logout {
          background: #FFF5F5;
          border-color: #FEE2E2;
        }
        .settings-item-btn.logout:hover {
          background: #FEE2E2;
        }
        .settings-item-btn.logout .settings-item-icon {
          color: #EF4444;
        }
        .settings-item-btn.logout .settings-item-label {
          color: #EF4444;
        }

        /* ── My Orders Page Layout ── */
        .orders-toggle-bar {
          display: flex;
          background: #F4F4F4;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
        }
        .orders-toggle-btn {
          flex: 1;
          padding: 10px 0;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: center;
        }
        .orders-toggle-btn.active {
          background: #0D0D0D;
          color: #ffffff;
        }
        .orders-toggle-btn:not(.active) {
          background: transparent;
          color: #71717A;
        }
        .order-list-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .order-history-card {
          background: #F8F8F6;
          border: 1px solid #EAEAEA;
          border-radius: 20px;
          padding: 1.25rem;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
        }
        .order-history-card:hover {
          background: #F2F2EF;
        }
        .order-hist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px dashed #E2E2E2;
          padding-bottom: 8px;
        }
        .order-hist-date {
          font-size: 11px;
          color: #71717A;
        }
        .order-hist-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }
        .order-hist-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .order-hist-item-img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
          background: #EAEAEA;
        }
        .order-hist-item-name {
          font-size: 13px;
          font-weight: 700;
          color: #0D0D0D;
        }
        .order-hist-item-qty {
          font-size: 11px;
          color: #71717A;
          margin-left: auto;
        }
        .order-hist-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .order-hist-price {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #0D0D0D;
        }
        .orders-empty-state {
          text-align: center;
          padding: 4rem 1rem;
          color: #71717A;
        }
        /* ── Profile Edit Bottom Sheet ── */
        .pe-overlay {
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
        .pe-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .pe-sheet {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 560px;
          padding: 1.25rem 1.25rem 1.75rem;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          text-align: left;
          max-height: 85vh;
          overflow-y: auto;
        }
        .pe-overlay.open .pe-sheet {
          transform: translateY(0);
        }
        .pe-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .pe-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #0D0D0D;
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
        
        /* Form elements styling */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
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
        }
        .form-input:focus {
          border-color: #0D0D0D;
          background: #ffffff;
        }

        /* ── Address & Payment Manager Sheets ── */
        .profile-sheet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 600;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .profile-sheet-content {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 560px;
          padding: 1.5rem 1.25rem 2.5rem;
          text-align: left;
          max-height: 85vh;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .profile-sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .profile-sheet-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 900;
          color: #0D0D0D;
        }

        .profile-sheet-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #0D0D0D;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        /* Saved address cards inside manager */
        .manager-address-card {
          border: 1px solid #EAEAEA;
          border-radius: 16px;
          padding: 1rem;
          background: #F8F8F6;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .manager-address-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .manager-address-tag {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          background: #0D0D0D;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          align-self: flex-start;
        }

        .manager-address-line {
          font-size: 13px;
          color: #71717A;
          line-height: 1.4;
        }

        .manager-address-delete-btn {
          background: none;
          border: none;
          color: #EF4444;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s;
        }

        .manager-address-delete-btn:hover {
          opacity: 0.8;
        }

        .manager-add-btn {
          width: 100%;
          border: 1.5px dashed #C4C4C4;
          border-radius: 16px;
          padding: 14px;
          background: transparent;
          color: #71717A;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color 0.15s, color 0.15s;
          margin-top: 1rem;
        }

        .manager-add-btn:hover {
          border-color: #0D0D0D;
          color: #0D0D0D;
        }

        /* Payment selection grid mockup */
        .payment-method-row-card {
          border: 1.5px solid #EAEAEA;
          border-radius: 16px;
          padding: 1.25rem 1rem;
          background: #F8F8F6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .payment-method-row-card.active {
          border-color: #0D0D0D;
          background: #ffffff;
        }

        .payment-method-row-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-method-row-icon {
          color: #0D0D0D;
          display: flex;
          align-items: center;
        }

        .payment-method-row-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .payment-method-row-title {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: #0D0D0D;
        }

        .payment-method-row-sub {
          font-size: 11px;
          color: #71717A;
          margin-top: 1px;
        }
      `}</style>

      {/* ── VIEW 1: PROFILE DASHBOARD ── */}
      {profileView === "dashboard" && (
        <>
          {/* Header Info */}
          <div className="profile-header-section">
            <div className="avatar-container">
              <div className="avatar-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 22 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.08 20 6.54 18.52 5.07 16.28C5.1 14 9.67 12.75 12 12.75C14.32 12.75 18.9 14 18.93 16.28C17.46 18.52 14.92 20 12 20Z" fill="currentColor"/>
                </svg>
              </div>
              <button className="avatar-edit-btn pointer" onClick={handleOpenEdit} title="Edit Profile">
                <PencilSimple size={14} weight="bold" />
              </button>
            </div>
            <h2 className="profile-user-name">{userProfile?.name || (userProfile?.email ? userProfile.email.split('@')[0] : "Guest User")}</h2>
            <p className="profile-user-phone">{userProfile?.phone || "No phone number"}</p>
          </div>

          {/* Track Order Section */}
          <div className="profile-section-title-row" style={{ marginTop: 0 }}>
            <h3 className="profile-section-title">Track Order</h3>
          </div>

          <div className="profile-gray-card">
            {ongoingOrder ? (
              <>
                <div className="order-header-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="recent-order-img-container">
                      <img
                        src={ongoingOrder.items?.[0]?.product?.images?.[0] || ""}
                        alt={ongoingOrder.items?.[0]?.product?.name || ongoingOrder.items?.[0]?.name || "streetwear bundle"}
                      />
                    </div>
                    <div>
                      <span className="order-id-label">#{ongoingOrder.shortId || ongoingOrder._id?.slice(-6).toUpperCase()}</span>
                      <h4 className="order-product-name">
                        {ongoingOrder.items?.[0]?.product?.name || ongoingOrder.items?.[0]?.name || "streetwear bundle"}
                        {ongoingOrder.items?.length > 1 && ` + ${ongoingOrder.items.length - 1} items`}
                      </h4>
                    </div>
                  </div>
                  <span className="order-status-badge">{ongoingOrder.status}</span>
                </div>

                {/* Stepper tracker */}
                <div className="stepper-bar-container">
                  <div className="stepper-track-line" />
                  <div
                    className="stepper-track-fill"
                    style={{
                      width:
                        ongoingOrder.status === "Placed"
                          ? "0%"
                          : ongoingOrder.status === "Confirmed"
                          ? "33%"
                          : ongoingOrder.status === "Shipped"
                          ? "66%"
                          : "100%"
                    }}
                  />
                  <div className="stepper-nodes-row">
                    <div className="stepper-node-col">
                      <div className="stepper-dot active">
                        <div className="stepper-dot-inner" />
                      </div>
                      <span className="stepper-node-label active">Placed</span>
                    </div>
                    <div className="stepper-node-col">
                      <div
                        className={`stepper-dot${
                          ongoingOrder.status !== "Placed" ? " active" : ""
                        }`}
                      >
                        <div className="stepper-dot-inner" />
                      </div>
                      <span
                        className={`stepper-node-label${
                          ongoingOrder.status !== "Placed" ? " active" : ""
                        }`}
                      >
                        Confirmed
                      </span>
                    </div>
                    <div className="stepper-node-col">
                      <div
                        className={`stepper-dot${
                          ongoingOrder.status === "Shipped" || ongoingOrder.status === "Delivered"
                            ? " active"
                            : ""
                        }`}
                      >
                        <div className="stepper-dot-inner" />
                      </div>
                      <span
                        className={`stepper-node-label${
                          ongoingOrder.status === "Shipped" || ongoingOrder.status === "Delivered"
                            ? " active"
                            : ""
                        }`}
                      >
                        Shipped
                      </span>
                    </div>
                    <div className="stepper-node-col">
                      <div
                        className={`stepper-dot${
                          ongoingOrder.status === "Delivered" ? " active" : ""
                        }`}
                      >
                        <div className="stepper-dot-inner" />
                      </div>
                      <span
                        className={`stepper-node-label${
                          ongoingOrder.status === "Delivered" ? " active" : ""
                        }`}
                      >
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="stepper-buttons-row">
                  {ongoingOrder.status === "Placed" && (
                    <button className="cancel-order-btn" onClick={() => handleCancelOrder(ongoingOrder._id || ongoingOrder.id)}>
                      Cancel Order
                    </button>
                  )}
                  {ongoingOrder.trackingLink && (
                    <a
                      href={ongoingOrder.trackingLink.startsWith('http') ? ongoingOrder.trackingLink : `https://${ongoingOrder.trackingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-external-btn"
                    >
                      <ArrowSquareOut size={14} weight="bold" />
                      <span>Track Order</span>
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem 0", color: "#999999", fontSize: "0.95rem" }}>
                No active ongoing orders to track.
              </div>
            )}
          </div>

          {/* Recent Order Section */}
          <div className="profile-section-title-row">
            <h3 className="profile-section-title">Recent Order</h3>
            <Clock size={18} className="profile-section-icon" />
          </div>

          {pastOrder ? (
            <div
              className="recent-order-box"
              onClick={() => {
                setTrackingOrder(pastOrder);
                setProfileView("tracking");
              }}
            >
              <div className="recent-order-left">
                <div className="recent-order-img-container">
                  <img
                    src={pastOrder.items?.[0]?.product?.images?.[0] || pastOrder.items?.[0]?.image || ""}
                    alt={pastOrder.items?.[0]?.product?.name || pastOrder.items?.[0]?.name}
                  />
                </div>
                <div>
                  <h4 className="recent-order-title">{pastOrder.items?.[0]?.product?.name || pastOrder.items?.[0]?.name || "streetwear item"}</h4>
                  <p className="recent-order-status-info">
                    Status: {pastOrder.status} · Rs. {pastOrder.totalAmount || pastOrder.total}
                  </p>
                </div>
              </div>
              <CaretRight size={18} className="recent-order-chevron" />
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem", background: "#F8F8F6", borderRadius: "20px", color: "#999999", fontSize: "0.95rem", border: "1px solid #EAEAEA" }}>
              No recent orders.
            </div>
          )}

          {/* Account Settings Section */}
          <div className="profile-section-title-row">
            <h3 className="profile-section-title">Account Settings</h3>
          </div>

          <div className="settings-list">
            <button className="settings-item-btn" onClick={() => setProfileView("my-orders")}>
              <div className="settings-item-left">
                <span className="settings-item-icon">
                  <ShoppingBag size={20} />
                </span>
                <span className="settings-item-label">All My Orders</span>
              </div>
              <CaretRight size={16} className="settings-item-chevron" />
            </button>

            <button className="settings-item-btn" onClick={() => setAddressManagerOpen(true)}>
              <div className="settings-item-left">
                <span className="settings-item-icon">
                  <MapPin size={20} />
                </span>
                <span className="settings-item-label">Shipping Address</span>
              </div>
              <CaretRight size={16} className="settings-item-chevron" />
            </button>

            <button className="settings-item-btn" onClick={() => setPaymentManagerOpen(true)}>
              <div className="settings-item-left">
                <span className="settings-item-icon">
                  <CreditCard size={20} />
                </span>
                <span className="settings-item-label">Payment Methods</span>
              </div>
              <CaretRight size={16} className="settings-item-chevron" />
            </button>

            <button className="settings-item-btn logout" onClick={handleLogout}>
              <div className="settings-item-left">
                <span className="settings-item-icon">
                  <SignOut size={20} />
                </span>
                <span className="settings-item-label">Logout Account</span>
              </div>
              <CaretRight size={16} className="settings-item-chevron" />
            </button>
          </div>
        </>
      )}

      {/* ── VIEW 2: MY ORDERS LIST ── */}
      {profileView === "my-orders" && (
        <div>
          {/* Ongoing vs History Toggle Tab */}
          <div className="orders-toggle-bar">
            <button
              className={`orders-toggle-btn${activeOrderTab === "ongoing" ? " active" : ""}`}
              onClick={() => setActiveOrderTab("ongoing")}
            >
              Ongoing
            </button>
            <button
              className={`orders-toggle-btn${activeOrderTab === "history" ? " active" : ""}`}
              onClick={() => setActiveOrderTab("history")}
            >
              History
            </button>
          </div>

          <div className="order-list-container">
            {filteredOrders.length === 0 ? (
              <div className="orders-empty-state">
                <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                <p>No orders found in this category.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="order-history-card"
                  onClick={() => {
                    setTrackingOrder(order);
                    setProfileView("tracking");
                  }}
                >
                  <div className="order-hist-header">
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#0D0D0D" }}>#{order.shortId || order._id?.slice(-6).toUpperCase()}</span>
                      <span className="order-hist-date" style={{ marginLeft: "10px" }}>({new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()})</span>
                    </div>
                    <span className="order-status-badge">{order.status}</span>
                  </div>

                  <div className="order-hist-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-hist-item-row">
                        <img
                          className="order-hist-item-img"
                          src={item.product?.images?.[0] || ""}
                          alt={item.product?.name || item.name}
                        />
                        <span className="order-hist-item-name">{item.product?.name || item.name}</span>
                        <span className="order-hist-item-qty">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-hist-footer">
                    <span className="order-hist-price">Rs. {order.totalAmount || order.total}</span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                      {order.status === "Placed" && (
                        <button className="cancel-order-btn" style={{ padding: "6px 12px" }} onClick={() => handleCancelOrder(order._id || order.id)}>
                          Cancel
                        </button>
                      )}
                      {order.trackingLink && (
                        <a
                          href={order.trackingLink.startsWith('http') ? order.trackingLink : `https://${order.trackingLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="track-external-btn"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                        >
                          <ArrowSquareOut size={12} weight="bold" />
                          <span>Track</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 3: ORDER TRACKING PAGE ── */}
      {profileView === "tracking" && trackingOrder && (
        <div>
          <div className="profile-gray-card" style={{ textAlign: "left" }}>
            <div className="order-header-row">
              <div>
                <span className="order-id-label">#{trackingOrder.shortId || trackingOrder._id?.slice(-6).toUpperCase()}</span>
                <h4 className="order-product-name">
                  {trackingOrder.items?.[0]?.product?.name || trackingOrder.items?.[0]?.name || "streetwear bundle"}
                  {trackingOrder.items?.length > 1 && ` + ${trackingOrder.items.length - 1} items`}
                </h4>
                <p className="order-hist-date" style={{ marginTop: "4px" }}>Ordered on {new Date(trackingOrder.createdAt || trackingOrder.date || Date.now()).toLocaleDateString()}</p>
              </div>
              <span className="order-status-badge">{trackingOrder.status}</span>
            </div>

            {/* Stepper tracker */}
            <div className="stepper-bar-container" style={{ margin: "1.5rem 0 1.25rem" }}>
              <div className="stepper-track-line" />
              <div
                className="stepper-track-fill"
                style={{
                  width:
                    trackingOrder.status === "Placed"
                      ? "0%"
                      : trackingOrder.status === "Confirmed"
                      ? "33%"
                      : trackingOrder.status === "Shipped"
                      ? "66%"
                      : "100%"
                }}
              />
              <div className="stepper-nodes-row">
                <div className="stepper-node-col">
                  <div className="stepper-dot active">
                    <div className="stepper-dot-inner" />
                  </div>
                  <span className="stepper-node-label active">Placed</span>
                </div>
                <div className="stepper-node-col">
                  <div
                    className={`stepper-dot${
                      trackingOrder.status !== "Placed" ? " active" : ""
                    }`}
                  >
                    <div className="stepper-dot-inner" />
                  </div>
                  <span
                    className={`stepper-node-label${
                      trackingOrder.status !== "Placed" ? " active" : ""
                    }`}
                  >
                    Confirmed
                  </span>
                </div>
                <div className="stepper-node-col">
                  <div
                    className={`stepper-dot${
                      trackingOrder.status === "Shipped" || trackingOrder.status === "Delivered"
                        ? " active"
                        : ""
                    }`}
                  >
                    <div className="stepper-dot-inner" />
                  </div>
                  <span
                    className={`stepper-node-label${
                      trackingOrder.status === "Shipped" || trackingOrder.status === "Delivered"
                        ? " active"
                        : ""
                    }`}
                  >
                    Shipped
                  </span>
                </div>
                <div className="stepper-node-col">
                  <div
                    className={`stepper-dot${
                      trackingOrder.status === "Delivered" ? " active" : ""
                    }`}
                  >
                    <div className="stepper-dot-inner" />
                  </div>
                  <span
                    className={`stepper-node-label${
                      trackingOrder.status === "Delivered" ? " active" : ""
                    }`}
                  >
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            <div className="stepper-buttons-row">
              {trackingOrder.status === "Placed" && (
                <button className="cancel-order-btn" onClick={() => handleCancelOrder(trackingOrder._id || trackingOrder.id)}>
                  Cancel Order
                </button>
              )}
              {trackingOrder.trackingLink && (
                <a
                  href={trackingOrder.trackingLink.startsWith('http') ? trackingOrder.trackingLink : `https://${trackingOrder.trackingLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-external-btn"
                >
                  <ArrowSquareOut size={14} weight="bold" />
                  <span>Track Courier Link</span>
                </a>
              )}
            </div>
          </div>

          {/* Items Summary in tracking */}
          <div className="profile-section-title-row">
            <h3 className="profile-section-title">Order Items</h3>
          </div>
          <div className="order-list-container">
            {trackingOrder.items?.map((item, idx) => (
              <div key={idx} className="recent-order-box" style={{ cursor: "default" }}>
                <div className="recent-order-left">
                  <div className="recent-order-img-container">
                    <img src={item.product?.images?.[0] || item.image || ""} alt={item.product?.name || item.name} />
                  </div>
                  <div>
                    <h4 className="recent-order-title">{item.product?.name || item.name}</h4>
                    <p className="recent-order-status-info">
                      Rs. {item.priceAtTime || item.price} · Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="order-hist-price">Rs. {(item.priceAtTime || item.price) * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Profile Edit Bottom Sheet Modal ── */}
      <div className={`pe-overlay${editProfileOpen ? " open" : ""}`} onClick={() => setEditProfileOpen(false)}>
        <div className="pe-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="pe-header">
            <span className="pe-title">Edit Profile Details</span>
            <button className="pe-close pointer" onClick={() => setEditProfileOpen(false)}>
              <X size={20} weight="bold" />
            </button>
          </div>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary pointer" style={{ justifyContent: "center", padding: "12px", width: "100%", marginTop: "0.25rem" }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* ── ADDRESS MANAGER OVERLAY MODAL ── */}
      {addressManagerOpen && (
        <div className="profile-sheet-overlay" onClick={() => setAddressManagerOpen(false)}>
          <div className="profile-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-sheet-header">
              <h3 className="profile-sheet-title">Manage Shipping Addresses</h3>
              <button className="profile-sheet-close" onClick={() => setAddressManagerOpen(false)}>
                <X size={20} weight="bold" />
              </button>
            </div>

            {addAddressOpen ? (
              <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                <div style={{ display: "flex", gap: "12px", marginTop: "0.5rem" }}>
                  <button type="submit" className="place-order-submit-btn" style={{ flex: 1 }}>
                    Save Address
                  </button>
                  <button type="button" className="btn-secondary pointer" style={{ padding: "12px", borderRadius: "16px" }} onClick={() => setAddAddressOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {addresses.map((addr) => (
                    <div key={addr.id} className="manager-address-card">
                      <div className="manager-address-left">
                        <span className="manager-address-tag">{addr.tag}</span>
                        <span className="manager-address-line" style={{ fontWeight: 800, color: "#000" }}>{addr.name}</span>
                        <span className="manager-address-line">{addr.addressLine}</span>
                      </div>
                      <button className="manager-address-delete-btn" onClick={() => handleDeleteAddress(addr.id)}>
                        <X size={18} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="manager-add-btn" onClick={() => setAddAddressOpen(true)}>
                  <span>+ Add New Address</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PAYMENT METHODS OVERLAY MODAL ── */}
      {paymentManagerOpen && (
        <div className="profile-sheet-overlay" onClick={() => setPaymentManagerOpen(false)}>
          <div className="profile-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-sheet-header">
              <h3 className="profile-sheet-title">My Payment Methods</h3>
              <button className="profile-sheet-close" onClick={() => setPaymentManagerOpen(false)}>
                <X size={20} weight="bold" />
              </button>
            </div>
            <div>
              <div className="payment-method-row-card active">
                <div className="payment-method-row-left">
                  <span className="payment-method-row-icon"><CreditCard size={24} weight="bold" /></span>
                  <div className="payment-method-row-info">
                    <span className="payment-method-row-title">Online Payment / UPI / Netbanking</span>
                    <span className="payment-method-row-sub">Default secure checkout gateway</span>
                  </div>
                </div>
              </div>
              <div className="payment-method-row-card">
                <div className="payment-method-row-left">
                  <span className="payment-method-row-icon"><ShoppingBag size={24} weight="bold" /></span>
                  <div className="payment-method-row-info">
                    <span className="payment-method-row-title">Cash on Delivery (COD)</span>
                    <span className="payment-method-row-sub">Pay at your doorstep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
