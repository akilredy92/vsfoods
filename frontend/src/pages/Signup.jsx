import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/userContext.jsx";

export default function Signup() {
  const { login } = useUser();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);

  useEffect(() => {
    setFirstName(""); setLastName(""); setEmail("");
    setCountryCode("+1"); setPhone(""); setPassword(""); setConfirm("");
    setError(""); window.scrollTo(0,0);
  }, []);

  const phoneDigits = useMemo(() => phone.replace(/[^\d]/g, ""), [phone]);
  const hasEmailOrPhone = (email && /^\S+@\S+\.\S+$/.test(email)) || phoneDigits.length > 0;
  const passOk = password.length >= 8;
  const match  = confirm.length > 0 && confirm === password;

  const canSubmit = firstName.trim() && hasEmailOrPhone && passOk && match;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!firstName.trim()) return setError("First name is required");
      if (!hasEmailOrPhone)  return setError("Provide a valid email or phone");
      if (!passOk)           return setError("Password must be at least 8 characters");
      if (!match)            return setError("Passwords do not match");
    }
    const fullPhone = phoneDigits ? `${countryCode}${phoneDigits}` : "";
    login({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), phone: fullPhone, method: "signup", isRegistered: true });
    navigate("/");
  };

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Register to get 5% off at checkout.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label>First name *</label>
            <input className="input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="Enter first name" required />
          </div>

          <div className="field">
            <label>Last name</label>
            <input className="input" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Enter last name" />
          </div>

          <div className="field">
            <label>Email (or phone)</label>
            <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            <div className="or-hint">or</div>
            <div className="phone-field">
              <select className="select" value={countryCode} onChange={(e)=>setCountryCode(e.target.value)}>
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+61">🇦🇺 +61 (Australia)</option>
              </select>
              <input className="input" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="555 555 5555" />
            </div>
            <p className="hint">Provide either email or phone.</p>
          </div>

          {/* Password with eye toggle */}
          <div className="field password-field">
            <label>Password *</label>
            <div className="password-input">
              <input
                className={`input ${password && !passOk ? "input-error" : ""}`}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
              />
              <button type="button" className="toggle-eye" onClick={()=>setShowPw(s=>!s)} aria-label={showPw?"Hide password":"Show password"}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {!passOk && password && <p className="error">Password must be at least 8 characters.</p>}
          </div>

          {/* Confirm with eye toggle */}
          <div className="field password-field">
            <label>Confirm password *</label>
            <div className="password-input">
              <input
                className={`input ${confirm && !match ? "input-error" : ""}`}
                type={showConf ? "text" : "password"}
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
              />
              <button type="button" className="toggle-eye" onClick={()=>setShowConf(s=>!s)} aria-label={showConf?"Hide password":"Show password"}>
                {showConf ? "🙈" : "👁️"}
              </button>
            </div>
            {confirm && !match && <p className="error">Passwords do not match.</p>}
          </div>

          {error && <p className="error" style={{marginTop:4}}>{error}</p>}

          <div className="actions">
            <button className="btn primary" type="submit" disabled={!canSubmit}>Register</button>
            <a className="btn ghost" href="/login">I already have an account</a>
          </div>
        </form>
      </section>
    </main>
  );
}
