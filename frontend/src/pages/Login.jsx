import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/userContext";

/**
 * Login page:
 * - "Email" tab: email + password, no MFA
 * - "Mobile" tab: phone -> send OTP -> verify (2-step MFA)
 * This ships with a DEV-only OTP generator. Replace sendOtp() with your backend SMS.
 */
export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const [tab, setTab] = useState("email"); // 'email' | 'phone'

  // Email mode state
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const emailValid = useMemo(
    () => /^\S+@\S+\.\S+$/.test(email),
    [email]
  );
  const pwOk = pw.length >= 8;

  // Phone MFA state
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("request"); // 'request' | 'verify'
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [seconds, setSeconds] = useState(0); // resend timer
  const phoneValid = useMemo(
    () => /^[0-9+\-() ]{7,}$/.test(phone.trim()),
    [phone]
  );

  const [error, setError] = useState("");

  // reset form on mount
  useEffect(() => {
    setTab("email");
    setEmail("");
    setPw("");
    setPhone("");
    setStage("request");
    setOtp("");
    setServerOtp("");
    setSeconds(0);
    setError("");
    window.scrollTo(0, 0);
  }, []);

  // resend timer tick
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // ----- Actions -----

  // DEV: simulate sending OTP. Replace with real SMS API call.
  const sendOtp = async () => {
    if (!phoneValid) {
      setError("Enter a valid mobile number");
      return;
    }
    setError("");
    // Simulate server-provided OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(code);
    setStage("verify");
    setSeconds(45);

    // In production: await fetch('/api/auth/send-otp', { method:'POST', body: JSON.stringify({ phone }) })
    // Server should persist OTP (or return one-time token) and send SMS via Twilio/MSG91/etc.
  };

  const verifyOtp = () => {
    if (otp.length !== 6) return setError("Enter the 6-digit code");
    if (otp !== serverOtp) return setError("Invalid or expired code");
    setError("");

    // Log user in with phone
    login({ firstName: "Customer", phone, method: "phone" });
    navigate("/");
  };

  const emailLogin = (e) => {
    e.preventDefault();
    if (!emailValid) return setError("Enter a valid email");
    if (!pwOk) return setError("Password must be at least 8 characters");
    setError("");
    // Normally you'd verify credentials server-side.
   login({ firstName: "Customer", email, method: "email" });
   navigate("/");
  };

  const switchTo = (next) => {
    setTab(next);
    setError("");
    // reset per-mode fields when switching
    if (next === "email") {
      setStage("request");
      setPhone("");
      setOtp("");
      setServerOtp("");
      setSeconds(0);
    } else {
      setEmail("");
      setPw("");
    }
  };

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-sub">Welcome back to VS Foods.</p>

        {/* Tabs */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${tab === "email" ? "active" : ""}`}
            onClick={() => switchTo("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`tab ${tab === "phone" ? "active" : ""}`}
            onClick={() => switchTo("phone")}
          >
            Mobile
          </button>
        </div>

        {/* EMAIL MODE */}
        {tab === "email" && (
          <form className="form" onSubmit={emailLogin} noValidate>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
              />
              <p className="hint">Minimum 8 characters.</p>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="actions">
              <button className="btn primary" type="submit">
                Sign in
              </button>
              <a className="btn ghost" href="/signup">
                Create an account
              </a>
            </div>
          </form>
        )}

        {/* PHONE MODE (2-step MFA) */}
        {tab === "phone" && (
          <div className="form">
            {stage === "request" && (
              <>
                <div className="field">
                  <label>Mobile number</label>
                  <input
                    className="input"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>

                {error && <p className="error">{error}</p>}

                <div className="actions">
                  <button
                    className="btn primary"
                    type="button"
                    onClick={sendOtp}
                    disabled={!phoneValid}
                  >
                    Send code
                  </button>
                  <a className="btn ghost" href="/signup">
                    Create an account
                  </a>
                </div>
              </>
            )}

            {stage === "verify" && (
              <>
                <div className="field">
                  <label>Enter 6-digit code</label>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                  />
                  <p className="hint">
                    We sent a code to <strong>{phone}</strong>
                    {process.env.NODE_ENV !== "production" && serverOtp
                      ? ` • (DEV code: ${serverOtp})`
                      : ""}
                  </p>
                </div>

                {error && <p className="error">{error}</p>}

                <div className="actions">
                  <button
                    className="btn primary"
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                  >
                    Verify & sign in
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={sendOtp}
                    disabled={seconds > 0}
                    title={seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
                  >
                    {seconds > 0 ? `Resend (${seconds})` : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
