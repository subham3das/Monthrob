import React, { useState } from "react";
import { Eye, EyeSlash, EnvelopeSimple, Lock, GoogleLogo, ArrowRight, SpinnerGap } from "@phosphor-icons/react";
import { loginUser, googleLoginUser } from "../api";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage({ setAuthUser, setActivePage, setUserProfile }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password });
      const user = res.data;
      localStorage.setItem("monthrob_auth", JSON.stringify(user));
      const profile = { name: user.name, phone: user.phone || "" };
      localStorage.setItem("monthrob_profile", JSON.stringify(profile));
      if (setUserProfile) setUserProfile(profile);
      setAuthUser(user);
      setActivePage("home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const res = await googleLoginUser(tokenResponse.access_token);
        const user = res.data;
        localStorage.setItem("monthrob_auth", JSON.stringify(user));
        const profile = { name: user.name, phone: user.phone || "" };
        localStorage.setItem("monthrob_profile", JSON.stringify(profile));
        if (setUserProfile) setUserProfile(profile);
        setAuthUser(user);
        setActivePage("home");
      } catch (err) {
        setError(err.response?.data?.message || "Google Sign-In failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Sign-In was cancelled or failed.");
    }
  });

  return (
    <div className="auth-page-root">
      <style>{`
        .auth-page-root {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .auth-page-root::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-page-root::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -60px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 2;
          animation: authSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes authSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-brand {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-brand-logo {
          height: 32px;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .auth-brand-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 900;
          color: #0D0D0D;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
        }

        .auth-brand-subtitle {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: #71717A;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .auth-input-group {
          position: relative;
        }

        .auth-input-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 800;
          color: #A1A1AA;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #FAFAFA;
          border: 1.5px solid #E4E4E7;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .auth-input-wrapper.focused {
          border-color: #0D0D0D;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.04);
        }

        .auth-input-wrapper.error {
          border-color: #EF4444;
          background: #FEF2F2;
        }

        .auth-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0 0 1rem;
          color: #A1A1AA;
          transition: color 0.3s;
          flex-shrink: 0;
        }

        .auth-input-wrapper.focused .auth-input-icon {
          color: #0D0D0D;
        }

        .auth-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.95rem 1rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          color: #0D0D0D;
          outline: none;
          width: 100%;
        }

        .auth-input::placeholder {
          color: #C4C4CC;
          font-weight: 400;
        }

        .auth-toggle-pw {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem 0 0;
          background: none;
          border: none;
          color: #A1A1AA;
          cursor: pointer;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .auth-toggle-pw:hover {
          color: #0D0D0D;
        }

        .auth-error {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #EF4444;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: authShake 0.4s ease;
        }

        @keyframes authShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .auth-forgot {
          text-align: right;
          margin-top: -0.5rem;
        }

        .auth-forgot a {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: #71717A;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .auth-forgot a:hover {
          color: #0D0D0D;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 14px;
          background: #0D0D0D;
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          margin-top: 0.25rem;
        }

        .auth-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .auth-submit-btn:hover::before {
          opacity: 1;
        }

        .auth-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-submit-btn .spinner {
          animation: authSpin 0.8s linear infinite;
        }

        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.75rem 0;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E4E4E7;
        }

        .auth-divider span {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          color: #A1A1AA;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .auth-google-btn {
          width: 100%;
          padding: 0.9rem 1rem;
          border: 1.5px solid #E4E4E7;
          border-radius: 14px;
          background: #FFFFFF;
          color: #0D0D0D;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .auth-google-btn:hover:not(:disabled) {
          border-color: #0D0D0D;
          background: #FAFAFA;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        .auth-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-google-icon {
          width: 20px;
          height: 20px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #F4F4F5;
        }

        .auth-footer-text {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #71717A;
        }

        .auth-footer-link {
          font-weight: 700;
          color: #0D0D0D;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          transition: color 0.2s;
        }

        .auth-footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #0D0D0D;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .auth-footer-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .auth-terms {
          text-align: center;
          margin-top: 1.25rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          color: #A1A1AA;
          line-height: 1.6;
        }

        .auth-terms a {
          color: #71717A;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>

      <div className="auth-card">
        {/* Brand Section */}
        <div className="auth-brand">
          <h1 className="auth-brand-title">Welcome Back</h1>
          <p className="auth-brand-subtitle">
            Sign in to access your account, orders, and exclusive collections.
          </p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleLogin}>
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-input-label">Email Address</label>
            <div className={`auth-input-wrapper ${focusedField === "email" ? "focused" : ""} ${error && !email ? "error" : ""}`}>
              <div className="auth-input-icon">
                <EnvelopeSimple size={18} weight="bold" />
              </div>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <div className={`auth-input-wrapper ${focusedField === "password" ? "focused" : ""} ${error && !password ? "error" : ""}`}>
              <div className="auth-input-icon">
                <Lock size={18} weight="bold" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="auth-forgot">
            <a onClick={() => {}}>Forgot password?</a>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <SpinnerGap size={20} className="spinner" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} weight="bold" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Google Sign In */}
        <button
          className="auth-google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="auth-google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer - Switch to Signup */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <span className="auth-footer-link" onClick={() => setActivePage("signup")}>
              Create Account
            </span>
          </p>
        </div>

        {/* Terms */}
        <div className="auth-terms">
          By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
