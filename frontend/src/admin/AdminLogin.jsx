import React, { useState } from "react";
import { ShieldCheck, EnvelopeSimple, Lock, ArrowRight, SpinnerGap } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, googleLoginUser } from "../api";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.data.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }
      onLoginSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const res = await googleLoginUser(tokenResponse.access_token);
        onLoginSuccess(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Google login failed");
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
    }
  });

  return (
    <div className="admin-login-container">
      <style>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8F9FA;
          padding: 2rem 1.25rem;
          font-family: var(--font-body, 'Outfit', sans-serif);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 14px;
          padding: 2.5rem 2rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-section {
          text-align: center;
          margin-bottom: 2rem;
        }

        .shield-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0F0F0F;
          color: #fff;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .brand-title {
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #1A1A1A;
          margin-bottom: 0.25rem;
          font-family: var(--font-heading, 'Outfit', sans-serif);
        }

        .brand-subtitle {
          font-size: 0.88rem;
          color: #71717A;
        }

        .form-layout {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #A1A1AA;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .input-box {
          display: flex;
          align-items: center;
          background: #FAFAFA;
          border: 1.5px solid #E4E4E7;
          border-radius: 14px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .input-box.focused {
          border-color: #0F0F0F;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.04);
        }

        .input-box input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.9rem 1rem;
          font-family: inherit;
          font-size: 0.92rem;
          font-weight: 500;
          color: #1A1A1A;
          outline: none;
        }

        .input-box input::placeholder {
          color: #C4C4CC;
        }

        .icon-holder {
          padding-left: 1rem;
          color: #A1A1AA;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .input-box.focused .icon-holder {
          color: #1A1A1A;
        }

        .error-banner {
          font-size: 0.82rem;
          color: #EF4444;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          animation: shake 0.35s ease;
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%,75% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 14px;
          background: #0F0F0F;
          color: #fff;
          font-family: inherit;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .submit-btn:hover:not(:disabled) {
          background: #2a2a2a;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .or-divider {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin: 0.5rem 0;
        }

        .or-divider::before,
        .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E4E4E7;
        }

        .or-divider span {
          font-size: 0.72rem;
          font-weight: 700;
          color: #A1A1AA;
          text-transform: uppercase;
        }

        .google-auth-btn {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1.5px solid #E4E4E7;
          border-radius: 14px;
          background: #fff;
          color: #1A1A1A;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .google-auth-btn:hover:not(:disabled) {
          border-color: #1A1A1A;
          background: #FAFAFA;
        }

        .google-icon {
          width: 18px;
          height: 18px;
        }

        .footer-note {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.75rem;
          color: #A1A1AA;
        }
      `}</style>

      <div className="login-card">
        <div className="brand-section">
          <div className="shield-badge">
            <ShieldCheck size={16} weight="fill" />
            Security Area
          </div>
          <h1 className="brand-title">Monthrob Control</h1>
          <p className="brand-subtitle">Sign in to manage the shop</p>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form className="form-layout" onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Email / ID</label>
            <div className={`input-box ${focusedField === "email" ? "focused" : ""}`}>
              <div className="icon-holder">
                <EnvelopeSimple size={18} />
              </div>
              <input
                type="text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className={`input-box ${focusedField === "password" ? "focused" : ""}`}>
              <div className="icon-holder">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <SpinnerGap size={20} className="spin-icon" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} weight="bold" />
              </>
            )}
          </button>
        </form>

        <div className="or-divider">
          <span>or</span>
        </div>

        <button type="button" className="google-auth-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="footer-note">Authorized personnel only</p>
      </div>
    </div>
  );
}
