import React, { useState, useEffect } from "react";
import { fetchShowcase } from "../api";
import { WarningCircle } from "@phosphor-icons/react";

export default function Hero({ onShopClick }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slides, setSlides] = useState([]);
  const [headlines, setHeadlines] = useState({ main: "", sub: "" });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displaySlides = slides.filter(s => {
    if (!s.platform || s.platform === 'All') return true;
    return isMobile ? s.platform === 'Mobile' : s.platform === 'Desktop';
  });

  useEffect(() => {
    fetchShowcase().then(res => {
      if (res.data) {
        setSlides(res.data.slides || []);
        setHeadlines({ main: res.data.mainHeadline, sub: res.data.subHeadline });
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % displaySlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  useEffect(() => {
    if (currentIdx >= displaySlides.length && displaySlides.length > 0) {
      setCurrentIdx(0);
    }
  }, [displaySlides.length, currentIdx]);

  if (loading) {
    return (
      <section style={{ width: "100%", height: "calc(100vh - 70px)", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#fff", fontFamily: "var(--font-heading)" }}>Loading...</span>
      </section>
    );
  }

  if (displaySlides.length === 0) {
    return (
      <section style={{ width: "100%", height: "calc(100vh - 70px)", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", textAlign: "center", padding: "0 20px" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: "900", marginBottom: "16px" }}>Our Admin Fell Asleep 😴</h2>
        <p style={{ color: "#A1A1AA", fontSize: "1.1rem", maxWidth: "600px", fontFamily: "var(--font-body)", lineHeight: "1.6" }}>
          We're supposed to have a super cool, breathtaking hero banner here, but the admin forgot to upload it. Don't worry, the shop is still open below while we go wake them up!
        </p>
      </section>
    );
  }

  const handleHeroClick = (slide) => {
    // If it has a link to a product or collection, maybe we navigate? 
    // The user didn't request navigation on hero yet, but we have onShopClick fallback
    if (onShopClick) onShopClick();
  };

  return (
    <section
      style={{
        width: "100%",
        height: "calc(100vh - 70px)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer"
      }}
      onClick={() => handleHeroClick(displaySlides[currentIdx])}
    >
      {displaySlides.map((slide, index) => (
        <div
          key={slide._id || index}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${slide.mediaUrl}")`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: index === currentIdx ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: 0
          }}
        />
      ))}
      
      {/* Dark overlay vignette to ensure high-end aesthetic */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
          zIndex: 1
        }}
      />

      <div style={{ position: "absolute", bottom: "10%", left: "5%", zIndex: 2, color: "#fff" }}>
        {headlines.main && <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", fontWeight: 900, marginBottom: "8px", textTransform: "uppercase" }}>{headlines.main}</h1>}
        {headlines.sub && <p style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 500, opacity: 0.9 }}>{headlines.sub}</p>}
      </div>
    </section>
  );
}
