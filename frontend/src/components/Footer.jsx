import React, { useState, useEffect } from "react";
import { TwitterLogo, InstagramLogo, TiktokLogo, PinterestLogo, CaretUp } from "@phosphor-icons/react";

export default function Footer({ setActivePage }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="main-footer">
      <style>{`
        .main-footer {
          background: #0D0D0D; /* Pure Black / Dark Mockup background */
          color: #A1A1AA; /* Light grey text */
          padding: 5rem 2rem 3rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 4rem;
          position: relative;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-logo-main {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          color: #FFFFFF;
        }
        .footer-desc {
          font-size: 0.95rem;
          opacity: 0.85;
          line-height: 1.6;
          max-width: 580px;
          margin: 0 auto 1.5rem auto;
          color: #A1A1AA;
        }
        .footer-social-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .footer-social-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1A1A1A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          transition: var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-social-circle:hover {
          background: #FFFFFF;
          color: #000000;
          transform: translateY(-2px);
          border-color: #FFFFFF;
        }
        .footer-sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          text-align: left;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }
        .footer-header {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1.5rem;
          color: #FFFFFF;
        }
        .footer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .footer-nav-item {
          background: transparent;
          border: none;
          color: #A1A1AA;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 0;
        }
        .footer-nav-item:hover {
          color: #FFFFFF;
          padding-left: 4px;
        }
        .circle-join-container {
          background: #161616;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: left;
        }
        .circle-join-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
        }
        .circle-join-desc {
          font-size: 0.88rem;
          color: #A1A1AA;
          line-height: 1.5;
        }
        .circle-join-form {
          display: flex;
          gap: 0.5rem;
        }
        .circle-join-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-body);
          font-size: 0.9rem;
          outline: none;
          background: #27272A;
          color: #FFFFFF;
          min-width: 0;
        }
        .circle-join-input:focus {
          border-color: #FFFFFF;
          background: #1C1C1E;
        }
        .circle-join-submit-btn {
          background: #FFFFFF;
          color: #000000;
          border: none;
          border-radius: 8px;
          padding: 0 1.25rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: var(--transition-fast);
          flex-shrink: 0;
        }
        .circle-join-submit-btn:hover {
          background: #E4E4E7;
        }
        .scroll-top-circle-btn {
          position: fixed;
          right: 1.5rem;
          bottom: 2rem;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #1A1A1A;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transform: translateY(12px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .scroll-top-circle-btn.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .scroll-top-circle-btn:hover {
          border-color: #FFFFFF;
          background: #FFFFFF;
          color: #000000;
          transform: translateY(-4px);
        }
        .footer-payment-icons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .footer-legal-container {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
          width: 100%;
        }

        /* Mobile Adjustments to Clear Bottom Mobile Nav Bar & Prevent Overlapping */
        @media (max-width: 768px) {
          .main-footer {
            padding-bottom: 96px;
          }
          .scroll-top-circle-btn {
            bottom: 76px; /* Floats above the mobile nav bar */
            right: 1rem;
          }
          .footer-legal-container {
            padding-left: 3.5rem;
            padding-right: 3.5rem;
          }
        }

        @media (max-width: 480px) {
          .circle-join-form {
            flex-direction: column;
            gap: 0.75rem;
          }
          .circle-join-submit-btn {
            padding: 0.75rem 1.25rem;
            justify-content: center;
          }
        }
      `}</style>

      {/* Brand & Description Section */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <img
            src="/logo.png"
            alt="Monthrob Logo"
            style={{
              height: "36px",
              objectFit: "contain",
              filter: "brightness(0) invert(1)"
            }}
          />
        </div>
        <p className="footer-desc">
          Elevating everyday streetwear with premium craftsmanship and a touch of the extraordinary. Precise designs for the modern minimalist.
        </p>

        {/* Social Icons Row */}
        <div className="footer-social-row">
          <a href="#" className="footer-social-circle pointer" aria-label="Instagram"><InstagramLogo size={22} weight="bold" /></a>
          <a href="#" className="footer-social-circle pointer" aria-label="TikTok"><TiktokLogo size={22} weight="bold" /></a>
          <a href="#" className="footer-social-circle pointer" aria-label="Twitter"><TwitterLogo size={22} weight="bold" /></a>
          <a href="#" className="footer-social-circle pointer" aria-label="Pinterest"><PinterestLogo size={22} weight="bold" /></a>
        </div>
      </div>

      {/* Footer Nav Links & Form Grid */}
      <div className="footer-sections-grid">
        {/* SHOP COLUMN */}
        <div>
          <h3 className="footer-header">Shop</h3>
          <div className="footer-nav-list">
            <button onClick={() => setActivePage("shop")} className="footer-nav-item">New Arrivals</button>
            <button onClick={() => setActivePage("shop")} className="footer-nav-item">Best Sellers</button>
            <button onClick={() => setActivePage("shop")} className="footer-nav-item">T-Shirts</button>
            <button onClick={() => setActivePage("shop")} className="footer-nav-item">Collections</button>
          </div>
        </div>

        {/* HELP COLUMN */}
        <div>
          <h3 className="footer-header">Support</h3>
          <div className="footer-nav-list">
            <button className="footer-nav-item">Customer Service</button>
            <button className="footer-nav-item">Shipping & Returns</button>
            <button className="footer-nav-item">Sizing Guide</button>
            <button className="footer-nav-item">Contact Us</button>
          </div>
        </div>

        {/* NEWSLETTER COLUMN */}
        <div>
          <h3 className="footer-header">Join the Circle</h3>
          {subscribed ? (
            <div style={{ textAlign: "left", padding: "1rem 0" }}>
              <p style={{ fontWeight: 700, color: "#16a34a", marginBottom: "0.5rem" }}>✓ Welcome to the Circle.</p>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Enjoy 10% off your first streetwear order. Code sent to inbox.</p>
            </div>
          ) : (
            <div className="circle-join-container">
              <h4 className="circle-join-title">Subscribe to Newsletter</h4>
              <p className="circle-join-desc">Receive exclusive previews of upcoming collection drops and priority order privileges.</p>
              <form onSubmit={handleSubscribe} className="circle-join-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="circle-join-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="circle-join-submit-btn pointer">
                  <span>Subscribe</span>
                  <span>➔</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-circle-btn pointer${visible ? " visible" : ""}`}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <CaretUp size={22} weight="bold" />
      </button>

      {/* Bottom Legal / Payment Row */}
      <div className="footer-legal-container">
        {/* Policies */}
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", opacity: 0.85 }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
        </div>

        {/* Payment Methods (Mockup Vector Icons) */}
        <div className="footer-payment-icons">
          {/* Visa */}
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <path d="M12.3 4L9.5 15.5H7.2L5 6C4.8 5.2 4.2 4.5 3.5 4.2V4H7.2L8.2 11.5L10.7 4H12.3ZM18.2 9.5C18.2 7 15.2 6.8 15.2 5.8C15.2 5.5 15.6 5.1 16.3 5.1C17.2 5 18 5.4 18.2 5.7L18.8 4.2C18.2 4 17.2 3.8 16.2 3.8C14.2 3.8 12.8 4.8 12.8 6.8C12.8 9.5 15.8 9.7 15.8 10.7C15.8 11 15.2 11.4 14.5 11.4C13.5 11.4 12.8 11 12.5 10.7L11.8 12.2C12.5 12.6 13.5 12.8 14.5 12.8C16.8 12.8 18.2 11.8 18.2 9.5ZM23.5 15.5L25.2 4H23.5L21.8 15.5H23.5ZM28 4H26.3L23.8 11.5L22.8 4H21.2L19.2 15.5H21L21.5 13H24.5L25 15.5H26.8L28 4Z" fill="#FFFFFF"/>
          </svg>
          {/* Mastercard */}
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <circle cx="10" cy="10" r="8" fill="#FFFFFF" fillOpacity="0.4"/>
            <circle cx="18" cy="10" r="8" fill="#FFFFFF" fillOpacity="0.6"/>
          </svg>
          {/* Credit Card */}
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <rect x="1" y="4" width="22" height="14" rx="2" stroke="#FFFFFF" strokeWidth="2"/>
            <line x1="1" y1="9" x2="23" y2="9" stroke="#FFFFFF" strokeWidth="2"/>
            <rect x="4" y="12" width="4" height="3" rx="0.5" fill="#FFFFFF"/>
          </svg>
          {/* Rotated Contactless/UPI phone */}
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <rect x="7" y="1" width="10" height="18" rx="2" transform="rotate(15 12 10)" stroke="#FFFFFF" strokeWidth="2"/>
            <circle cx="12" cy="16" r="1.5" fill="#FFFFFF"/>
            <path d="M3 7C2.5 8.5 2.5 11.5 3 13M21 7C21.5 8.5 21.5 11.5 21 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: "0.78rem", letterSpacing: "0.05em", color: "#71717a", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} monthrob.in. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
