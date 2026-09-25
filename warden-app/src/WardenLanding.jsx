import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// WARDEN — cybersecurity landing page (React)
// Single-file component. Drop into any React app (Vite/Next/CRA).
// No external CSS framework required — styles are scoped via the <style> tag below.
// Optional: swap the Google Fonts <link> in your app's index.html / _document
// for the same effect, or leave the fallback system fonts.
// ---------------------------------------------------------------------------

const LOG_POOL = [
  { tag: "ok", text: "connection established — edge-node-14 (ap-south-1)" },
  { tag: "ok", text: "baseline synced — 4,812 assets, 0 drift" },
  { tag: "warn", text: "unusual login geo — user jt.rivera (2 regions, 6m apart)" },
  { tag: "crit", text: "signature match — CVE-2025-31337 on host db-worker-07" },
  { tag: "ok", text: "session verified — mfa challenge passed, svc-billing" },
  { tag: "warn", text: "port scan detected — 203.0.113.44 → 19 hosts" },
  { tag: "crit", text: "lateral movement — svc-account priv escalation blocked" },
  { tag: "ok", text: "playbook complete — host isolated, case #4471 closed" },
  { tag: "ok", text: "threat intel sync — 1,204 new indicators ingested" },
  { tag: "warn", text: "anomalous egress — 1.8GB to unrecognized endpoint" },
];

const TAG_LABEL = { ok: "OK", warn: "WARN", crit: "CRIT" };

function timestamp() {
  const d = new Date();
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const FEATURES = [
  {
    title: "Real-time telemetry",
    body: "Stream endpoint, network and cloud events into a unified timeline with sub-second latency.",
    icon: (
      <path d="M2 9h3l2-5 4 10 2-5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Behavioral anomaly detection",
    body: "Baseline normal activity per identity and asset, then flag deviations models haven't seen labeled before.",
    icon: (
      <>
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 5.5v3.8l2.6 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Automated containment",
    body: "Isolate a host, revoke a session or block an IP the moment confidence crosses your threshold.",
    icon: (
      <path d="M9 2l6 2.5v4c0 3.7-2.5 6.4-6 7.5-3.5-1.1-6-3.8-6-7.5v-4L9 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "Threat intel correlation",
    body: "Match indicators against curated feeds and your own case history to cut false positives.",
    icon: (
      <path d="M3 13l3-6 3 3 3-6 3 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Compliance mapping",
    body: "Map controls straight to SOC 2, ISO 27001 and PCI-DSS so audits pull evidence, not screenshots.",
    icon: (
      <>
        <rect x="3" y="2.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 6.5h6M6 9.5h6M6 12.5h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Encrypted audit trail",
    body: "Every action a case takes is signed and tamper-evident, ready for a chain-of-custody review.",
    icon: (
      <>
        <rect x="4" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
];

const FLOW = [
  { n: "01", title: "Detect", body: "Sensors across endpoint, network and identity surface raw events as they happen." },
  { n: "02", title: "Correlate", body: "Related events are grouped into a single case, scored against intel and baseline behavior." },
  { n: "03", title: "Respond", body: "Run a playbook or a one-click action to isolate, revoke or block before impact spreads." },
  { n: "04", title: "Report", body: "A signed timeline of every action is ready for the retro, the audit, or the regulator." },
];

function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M13 2L23 6.5V12.5C23 18.5 18.7 22.8 13 24.5C7.3 22.8 3 18.5 3 12.5V6.5L13 2Z" stroke="#37E6B3" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 13L12 16L17.5 9.5" stroke="#37E6B3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureCard({ title, body, icon, delay }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-feature${inView ? " w-in-view" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-feature-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">{icon}</svg>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function WardenLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const feedRef = useRef(null);
  const idRef = useRef(0);

  function pushLine() {
    const item = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
    idRef.current += 1;
    const entry = { id: idRef.current, ts: timestamp(), tag: item.tag, text: item.text };
    setLines((prev) => {
      const next = [...prev, entry];
      return next.length > 8 ? next.slice(next.length - 8) : next;
    });
  }

  useEffect(() => {
    for (let i = 0; i < 6; i++) pushLine();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(pushLine, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="w-root">
      <style>{`
        .w-root{
          --bg:#0B0F14; --surface:#111721; --surface-2:#161E2A; --line:#232D3B;
          --text:#E4E9EF; --muted:#7C8A9A; --teal:#37E6B3; --amber:#FFB454; --red:#FF5C5C;
          --teal-dim: rgba(55,230,179,0.12);
          --font-display:'Space Grotesk','Segoe UI',sans-serif;
          --font-body:'Inter','Segoe UI',sans-serif;
          --font-mono:'JetBrains Mono','Courier New',monospace;
          background:var(--bg); color:var(--text); font-family:var(--font-body);
          line-height:1.5; -webkit-font-smoothing:antialiased; position:relative; overflow-x:hidden;
        }
        .w-root *{ box-sizing:border-box; }
        .w-root a{ color:inherit; text-decoration:none; }
        .w-root button{ font:inherit; cursor:pointer; border:none; background:none; color:inherit; }
        .w-root :focus-visible{ outline:2px solid var(--teal); outline-offset:3px; border-radius:4px; }
        .w-root h1,.w-root h2,.w-root h3{ font-family:var(--font-display); font-weight:600; letter-spacing:-0.01em; margin:0; }
        .w-root p{ margin:0; }

        .w-wrap{ max-width:1180px; margin:0 auto; padding:0 32px; }
        @media (max-width:640px){ .w-wrap{ padding:0 20px; } }

        .w-grid-bg{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size:48px 48px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%);
                  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%);
        }

        .w-eyebrow{
          font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; text-transform:uppercase;
          color:var(--teal); display:inline-flex; align-items:center; gap:8px;
        }
        .w-eyebrow::before{ content:""; width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px 1px var(--teal); }

        .w-header{ position:sticky; top:0; z-index:50; background:rgba(11,15,20,0.75); backdrop-filter:blur(10px); border-bottom:1px solid var(--line); }
        .w-nav{ display:flex; align-items:center; justify-content:space-between; height:72px; }
        .w-logo{ display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-weight:700; font-size:19px; letter-spacing:0.02em; }
        .w-nav-links{ display:flex; gap:32px; align-items:center; }
        .w-nav-links a{ font-size:14px; color:var(--muted); transition:color .15s ease; }
        .w-nav-links a:hover{ color:var(--text); }

        .w-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:11px 20px; font-size:14px; font-weight:500; border-radius:6px; transition:transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease; white-space:nowrap; }
        .w-btn-primary{ background:var(--teal); color:#06120D; font-weight:600; }
        .w-btn-primary:hover{ box-shadow:0 0 0 1px var(--teal), 0 0 24px -4px var(--teal); transform:translateY(-1px); }
        .w-btn-ghost{ color:var(--text); border:1px solid var(--line); }
        .w-btn-ghost:hover{ border-color:var(--muted); background:var(--surface); }

        .w-menu-toggle{ display:none; }

        .w-hero{ position:relative; z-index:1; padding:64px 0 64px; display:grid; grid-template-columns:1.05fr 0.95fr; gap:56px; align-items:center; }
        .w-hero h1{ font-size:clamp(34px,4.6vw,54px); line-height:1.06; margin:18px 0 20px; }
        .w-hero h1 em{ font-style:normal; color:var(--teal); }
        .w-lede{ color:var(--muted); font-size:17px; max-width:46ch; margin-bottom:32px; }
        .w-hero-ctas{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:36px; }
        .w-trust-line{ font-family:var(--font-mono); font-size:12px; color:var(--muted); display:flex; gap:18px; flex-wrap:wrap; align-items:center; }
        .w-trust-line b{ color:var(--text); font-weight:500; }
        @media (max-width:900px){ .w-hero{ grid-template-columns:1fr; } }

        .w-console{ position:relative; background:var(--surface); border:1px solid var(--line); border-radius:12px; overflow:hidden; box-shadow:0 30px 60px -30px rgba(0,0,0,0.6); }
        .w-console-head{ display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--line); background:var(--surface-2); }
        .w-console-dots{ display:flex; gap:6px; }
        .w-console-dots span{ width:8px; height:8px; border-radius:50%; background:#33404F; }
        .w-console-title{ font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:0.06em; }
        .w-console-status{ font-family:var(--font-mono); font-size:11px; color:var(--teal); display:flex; align-items:center; gap:6px; }
        .w-console-status::before{ content:""; width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 6px 1px var(--teal); }

        .w-radar{ position:relative; width:120px; height:120px; margin:28px auto 8px; border-radius:50%; border:1px solid var(--line);
          background: repeating-radial-gradient(circle, transparent 0, transparent 19px, rgba(55,230,179,0.06) 20px); }
        .w-radar::before{ content:""; position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 0deg, rgba(55,230,179,0.55), transparent 30%); animation:w-sweep 3.4s linear infinite; }
        .w-radar::after{ content:""; position:absolute; left:50%; top:50%; width:5px; height:5px; background:var(--teal); border-radius:50%; transform:translate(-50%,-50%); box-shadow:0 0 10px 2px var(--teal); }
        @keyframes w-sweep{ to{ transform:rotate(360deg); } }

        .w-log-feed{ font-family:var(--font-mono); font-size:12.5px; line-height:1.9; padding:6px 18px 20px; height:190px; overflow:hidden;
          -webkit-mask-image: linear-gradient(to bottom, black 78%, transparent 100%); mask-image: linear-gradient(to bottom, black 78%, transparent 100%); }
        .w-log-line{ white-space:nowrap; opacity:0; transform:translateY(4px); animation:w-enter .4s ease forwards; }
        @keyframes w-enter{ to{ opacity:1; transform:translateY(0); } }
        .w-tag{ padding:1px 6px; border-radius:3px; font-size:10.5px; margin-right:8px; }
        .w-tag-ok{ background:rgba(55,230,179,0.14); color:var(--teal); }
        .w-tag-warn{ background:rgba(255,180,84,0.14); color:var(--amber); }
        .w-tag-crit{ background:rgba(255,92,92,0.14); color:var(--red); }
        .w-ts{ color:#4B5A6B; margin-right:8px; }

        .w-stats{ position:relative; z-index:1; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:36px 0; }
        .w-stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .w-stat b{ display:block; font-family:var(--font-display); font-size:28px; color:var(--text); }
        .w-stat span{ font-size:13px; color:var(--muted); }
        @media (max-width:720px){ .w-stats-grid{ grid-template-columns:repeat(2,1fr); row-gap:28px; } }

        .w-section{ position:relative; z-index:1; padding:96px 0; }
        .w-section-head{ max-width:640px; margin-bottom:52px; }
        .w-section-head h2{ font-size:clamp(26px,3vw,36px); margin-top:14px; }
        .w-section-head p{ color:var(--muted); margin-top:14px; font-size:16px; }

        .w-feature-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
        .w-feature{ background:var(--bg); padding:32px 28px; opacity:0; transform:translateY(14px); transition:opacity .5s ease, transform .5s ease; }
        .w-feature.w-in-view{ opacity:1; transform:translateY(0); }
        .w-feature-icon{ width:38px; height:38px; border-radius:8px; background:var(--teal-dim); color:var(--teal); display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
        .w-feature h3{ font-size:17px; margin-bottom:8px; }
        .w-feature p{ color:var(--muted); font-size:14.5px; }
        @media (max-width:900px){ .w-feature-grid{ grid-template-columns:1fr 1fr; } }
        @media (max-width:600px){ .w-feature-grid{ grid-template-columns:1fr; } }

        .w-flow{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative; }
        .w-flow::before{ content:""; position:absolute; top:19px; left:6%; right:6%; height:1px; background:var(--line); }
        .w-flow-step{ position:relative; padding-right:20px; }
        .w-flow-num{ width:38px; height:38px; border-radius:50%; background:var(--surface); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:13px; color:var(--teal); position:relative; z-index:1; margin-bottom:18px; }
        .w-flow-step h3{ font-size:16px; margin-bottom:8px; }
        .w-flow-step p{ color:var(--muted); font-size:14px; }
        @media (max-width:800px){ .w-flow{ grid-template-columns:1fr; gap:32px; } .w-flow::before{ display:none; } }

        .w-quote-panel{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:44px; display:grid; grid-template-columns:1fr auto; gap:40px; align-items:center; }
        .w-quote-panel blockquote{ margin:0; font-family:var(--font-display); font-weight:500; font-size:clamp(19px,2.2vw,24px); line-height:1.4; }
        .w-quote-panel cite{ display:block; margin-top:18px; font-style:normal; font-size:14px; color:var(--muted); }
        .w-logo-strip{ display:flex; gap:28px; flex-wrap:wrap; margin-top:40px; font-family:var(--font-mono); font-size:13px; color:#4B5A6B; letter-spacing:0.04em; }
        @media (max-width:700px){ .w-quote-panel{ grid-template-columns:1fr; } }

        .w-cta-banner{ text-align:center; padding:80px 32px; border-radius:16px; background:radial-gradient(circle at 50% 0%, rgba(55,230,179,0.10), transparent 60%), var(--surface); border:1px solid var(--line); }
        .w-cta-banner h2{ font-size:clamp(26px,3.4vw,38px); margin-bottom:16px; }
        .w-cta-banner p{ color:var(--muted); margin-bottom:32px; }
        .w-cta-row{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

        .w-footer{ position:relative; z-index:1; border-top:1px solid var(--line); padding:48px 0 32px; }
        .w-foot-row{ display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:24px; }
        .w-foot-links{ display:flex; gap:24px; flex-wrap:wrap; }
        .w-foot-links a{ font-size:13.5px; color:var(--muted); }
        .w-foot-links a:hover{ color:var(--text); }
        .w-foot-fine{ font-size:12.5px; color:#4B5A6B; margin-top:32px; font-family:var(--font-mono); }

        @media (max-width:760px){
          .w-nav-links{ position:fixed; inset:72px 0 auto 0; background:var(--bg); flex-direction:column; align-items:flex-start; padding:20px 20px 28px; border-bottom:1px solid var(--line);
            transform:translateY(-8px); opacity:0; pointer-events:none; transition:opacity .18s ease, transform .18s ease; }
          .w-nav-links.w-open{ opacity:1; transform:translateY(0); pointer-events:auto; }
          .w-nav-links a{ font-size:16px; padding:8px 0; }
          .w-menu-toggle{ display:flex; flex-direction:column; gap:4px; padding:8px; }
          .w-menu-toggle span{ width:20px; height:2px; background:var(--text); }
          .w-nav .w-btn-primary{ display:none; }
        }

        @media (prefers-reduced-motion: reduce){
          .w-radar::before{ animation:none; }
          .w-log-line{ animation:none; opacity:1; transform:none; }
          .w-feature{ transition:none; }
        }
      `}</style>

      <div className="w-grid-bg" aria-hidden="true" />

      <header className="w-header">
        <div className="w-wrap w-nav">
          <a href="#top" className="w-logo">
            <Logo /> WARDEN
          </a>
          <nav className={`w-nav-links${menuOpen ? " w-open" : ""}`}>
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#trust" onClick={() => setMenuOpen(false)}>Trust</a>
            <a href="#contact" className="w-btn w-btn-primary" onClick={() => setMenuOpen(false)}>Request access</a>
          </nav>
          <button
            className="w-menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <main>
        <div className="w-wrap">
          <section className="w-hero" id="top">
            <div>
              <span className="w-eyebrow">Live threat detection &amp; response</span>
              <h1>See the breach<br /><em>before</em> it spreads.</h1>
              <p className="w-lede">WARDEN watches every endpoint, identity and packet in your estate, correlates the signal in real time, and contains the incident before it reaches your data.</p>
              <div className="w-hero-ctas">
                <a href="#contact" className="w-btn w-btn-primary">Request a demo</a>
                <a href="#platform" className="w-btn w-btn-ghost">See the platform</a>
              </div>
              <div className="w-trust-line">
                <span>Trusted by security teams at <b>240+</b> organizations</span>
                <span>·</span>
                <span><b>SOC 2 Type II</b> &amp; <b>ISO 27001</b></span>
              </div>
            </div>

            <div className="w-console" role="img" aria-label="Live security console showing streaming detection events">
              <div className="w-console-head">
                <div className="w-console-dots"><span></span><span></span><span></span></div>
                <div className="w-console-title">warden-console · prod-us-east</div>
                <div className="w-console-status">live</div>
              </div>
              <div className="w-radar" aria-hidden="true" />
              <div className="w-log-feed" ref={feedRef} aria-hidden="true">
                {lines.map((l) => (
                  <div className="w-log-line" key={l.id}>
                    <span className="w-ts">{l.ts}</span>
                    <span className={`w-tag w-tag-${l.tag}`}>{TAG_LABEL[l.tag]}</span>
                    <span>{l.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="w-stats">
          <div className="w-wrap w-stats-grid">
            <div className="w-stat"><b>41ms</b><span>Median time to detect</span></div>
            <div className="w-stat"><b>3.2M</b><span>Events ingested / sec</span></div>
            <div className="w-stat"><b>99.99%</b><span>Platform uptime</span></div>
            <div className="w-stat"><b>128</b><span>Native integrations</span></div>
          </div>
        </div>

        <div className="w-wrap">
          <section className="w-section" id="platform">
            <div className="w-section-head">
              <span className="w-eyebrow">Platform</span>
              <h2>One console, every signal.</h2>
              <p>Endpoint, network, identity and cloud telemetry, correlated in a single timeline so analysts stop context-switching between tools.</p>
            </div>
            <div className="w-feature-grid">
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.title} title={f.title} body={f.body} icon={f.icon} delay={(i % 3) * 80} />
              ))}
            </div>
          </section>

          <section className="w-section" id="how">
            <div className="w-section-head">
              <span className="w-eyebrow">Response cycle</span>
              <h2>From first signal to closed case.</h2>
              <p>A fixed sequence your analysts can trust under pressure — the same four steps, every time.</p>
            </div>
            <div className="w-flow">
              {FLOW.map((s) => (
                <div className="w-flow-step" key={s.n}>
                  <div className="w-flow-num">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-section" id="trust">
            <div className="w-quote-panel">
              <div>
                <blockquote>"We replaced four dashboards with one timeline. Our mean time to contain dropped from hours to minutes in the first quarter."</blockquote>
                <cite>— Head of Security Operations, mid-market fintech</cite>
              </div>
              <a href="#contact" className="w-btn w-btn-ghost">Read the case study</a>
            </div>
            <div className="w-logo-strip" aria-hidden="true">
              <span>NORTHFIELD BANK</span><span>ORBITAL HEALTH</span><span>CASCADE LOGISTICS</span><span>PENUMBRA LABS</span><span>KESTREL RETAIL</span>
            </div>
          </section>

          <section className="w-section" id="contact">
            <div className="w-cta-banner">
              <span className="w-eyebrow" style={{ marginBottom: 10, display: "inline-flex" }}>Get started</span>
              <h2>Bring your SOC into focus.</h2>
              <p>Book a walkthrough with a security engineer — see your own telemetry in the console within a week.</p>
              <div className="w-cta-row">
                <a href="#" className="w-btn w-btn-primary">Request a demo</a>
                <a href="#" className="w-btn w-btn-ghost">Talk to sales</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-footer">
        <div className="w-wrap">
          <div className="w-foot-row">
            <div className="w-logo"><Logo size={22} /> WARDEN</div>
            <div className="w-foot-links">
              <a href="#platform">Platform</a>
              <a href="#how">How it works</a>
              <a href="#trust">Trust</a>
              <a href="#">Status</a>
              <a href="#">Privacy</a>
            </div>
          </div>
          <div className="w-foot-fine">© 2026 Warden Security, Inc. All systems monitored. All events logged.</div>
        </div>
      </footer>
    </div>
  );
}
