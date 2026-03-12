import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import "./website.css";
import Particles from "./components/Particles";

interface SkillGroup {
  category: string;
  items: string[];
}

interface EducationEntry {
  school: string;
  short: string;
  degree: string;
  detail: string;
  note: string | null;
  logo: string;
  logoBg: string;
}

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  type: string;
  summary: string;
  tags: string[];
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}


const T = {
  fg:         "#1a2030",
  muted:      "#94a3b8",
  subtle:     "#d4dde8",
  accent:     "#4a7fa5",
  accentSoft: "rgba(74,127,165,0.08)",
  navBg:      "rgba(232,238,244,0.93)",
  bodyMuted:  "#5a7080",
};

const NAV_ITEMS = ["about", "education", "experience", "contact"] as const;
type NavItem = typeof NAV_ITEMS[number];

const SKILLS: SkillGroup[] = [
  { category: "Languages",    items: ["Kotlin", "Rust", "Java", "Go", "TypeScript", "SQL", "JavaScript", "Python"] },
  { category: "Frameworks",   items: ["Micronaut", "Axum", "Kafka Streams", "React", "Node.js", "Ktor", "Quarkus"] },
  { category: "Infra & Tools",items: ["Kubernetes", "Docker", "Helm", "Istio", "AWS", "Gradle", "Skaffold", "Nginx"] },
];

const EDUCATION: EducationEntry[] = [
  {
    school: "University of Texas — Austin",
    short: "UT Austin",
    degree: "M.S. Computer Science",
    detail: "Expected May 2028",
    note: null,
    logo: "/ut-austin.png",
    logoBg: "transparent",
  },
  {
    school: "University of Wisconsin — Madison",
    short: "UW–Madison",
    degree: "B.S. Computer Science · B.S. Mathematics",
    detail: "May 2022",
    note: "Minor in Entrepreneurship",
    logo: "/uw-madison.png",
    logoBg: "transparent",
  },
];

const EXPERIENCE: ExperienceEntry[] = [
  {
    title: "Senior Software Engineer",
    company: "Raft",
    period: "August 2024 – Present",
    type: "Remote",
    summary: "Built an observability platform to make aviation safer.",
    tags: ["Kotlin", "Rust", "Micronaut", "Postgres", "Helm", "Istio", "Kafka"],
  },
  {
    title: "Software Engineer",
    company: "Target",
    period: "Sept 2022 – Aug 2024",
    type: "Remote",
    summary: "Fullstack across Search Platform, Apply for Redcard, and IVY Pricing teams.",
    tags: ["Kotlin", "Kafka Streams", "MongoDB", "React", "Redux", "Kubernetes"],
  },
  {
    title: "Software Engineer",
    company: "LastLock",
    period: "Sept 2021 – June 2022",
    type: "Madison, WI",
    summary: "Worked on backend microservices for smart locks.",
    tags: ["TypeScript", "Go", "MongoDB", "AWS"],
  },
];

function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0 }: FadeInProps) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<NavItem>("about");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; email: string; message: string }>({
    name: "", email: "", message: "",
  });
  const [sent, setSent] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => {
      const y = window.scrollY + 130;
      NAV_ITEMS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
          setActive(id as NavItem);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await fetch("https://formspree.io/f/maqpokaj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
  };

  const handleLogoError = (ev: React.SyntheticEvent<HTMLImageElement>, short: string): void => {
    const target = ev.currentTarget;
    target.style.display = "none";
    if (target.parentNode) {
      (target.parentNode as HTMLElement).innerHTML =
        `<span style="font-family:'DM Mono',monospace;font-size:10px;color:white;text-align:center;padding:4px;line-height:1.3;">${short}</span>`;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", background: "#e8eef4", color: T.fg, minHeight: "100vh" }}>
     <Particles quantity={800} color="#4a7fa5" staticity={30} />

      {/* Nav */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:T.navBg, backdropFilter:"blur(16px)", borderBottom:`1px solid ${T.subtle}`, height:56, padding:"0 clamp(24px,6vw,80px)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span className="seattle-badge">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Seattle, WA
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <div className="dnav" style={{ display:"flex", gap:28 }}>
            {NAV_ITEMS.map((id) => (
              <button key={id} className={`nl ${active === id ? "act" : ""}`} onClick={() => scrollTo(id)}>
                {id}
              </button>
            ))}
          </div>
          <button className="mmb" onClick={() => setMenuOpen((o) => !o)} style={{ background:"none", border:"none", cursor:"pointer", flexDirection:"column", gap:5 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display:"block", width:20, height:1, background:T.fg }} />
            ))}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position:"absolute", top:56, left:0, right:0, background:T.navBg, borderBottom:`1px solid ${T.subtle}`, padding:"24px clamp(24px,6vw,80px)", display:"flex", flexDirection:"column", gap:22, zIndex:99, backdropFilter:"blur(16px)" }}>
            {NAV_ITEMS.map((id) => (
              <button key={id} className="nl" onClick={() => scrollTo(id)}>{id}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="about" style={{ minHeight:"100vh", padding:"56px clamp(24px,6vw,80px) 0", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ paddingTop:"8vh" }}>
          <p className="a2 mono" style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.muted, marginBottom:24 }}>
            Software Engineer · Fullstack
          </p>
          <h1 className="a1" style={{ fontSize:"clamp(48px,8.5vw,90px)", fontWeight:400, lineHeight:1.0, letterSpacing:"-0.02em", marginBottom:32, color:T.fg }}>
            Preetham<br />Mukkara<span style={{ color:T.accent }}>.</span>
          </h1>
          <p className="a3 mono" style={{ fontSize:"clamp(14px,1.8vw,17px)", lineHeight:1.9, color:T.bodyMuted, maxWidth:540, marginBottom:48, fontWeight:300 }}>
            Hi there! I'm Preetham, a software engineer who works on distributed systems,
            spends weekends on PNW trails, and has been emotionally invested in the Minnesota Vikings for longer
            than is medically advisable. Currently in Seattle, always in search of a good cup of coffee.
          </p>
          <div className="a4" style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
            <button className="btn-p" onClick={() => scrollTo("experience")}>View Experience</button>
            <button className="larrow" onClick={() => scrollTo("contact")} style={{ marginLeft:10 }}>
              Get in touch <span>→</span>
            </button>
          </div>
        </div>
        <div style={{ marginTop:"auto", paddingBottom:48, paddingTop:72 }}>
          <div style={{ width:1, height:52, background:`linear-gradient(to bottom, ${T.accent}, transparent)`, margin:"0 auto", opacity:0.5 }} />
        </div>
      </section>

      {/* Education */}
      <section id="education" style={{ padding:"80px clamp(24px,6vw,80px)", maxWidth:1000, margin:"0 auto" }}>
        <FadeIn><p className="slabel">Education</p></FadeIn>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {EDUCATION.map((e: EducationEntry, i: number) => (
            <FadeIn key={e.school} delay={i * 0.12}>
              <div className="edu-card">
                <div className="logo-wrap" style={{ background: e.logoBg }}>
                  <img src={e.logo} alt={e.short} onError={(ev) => handleLogoError(ev, e.short)} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                    <h3 style={{ fontSize:"clamp(17px,2.2vw,22px)", fontWeight:400, letterSpacing:"-0.01em", color:T.fg }}>
                      {e.school}
                    </h3>
                    <span className="mono" style={{ fontSize:11, color:T.muted, letterSpacing:"0.08em", whiteSpace:"nowrap", marginTop:3 }}>
                      {e.detail}
                    </span>
                  </div>
                  <p className="mono" style={{ fontSize:13, color:T.bodyMuted, marginTop:6 }}>{e.degree}</p>
                  {e.note && (
                    <p className="mono" style={{ fontSize:11, color:T.accent, letterSpacing:"0.06em", marginTop:6 }}>{e.note}</p>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" style={{ padding:"80px clamp(24px,6vw,80px)", maxWidth:1000, margin:"0 auto" }}>
        <FadeIn><p className="slabel">Work Experience</p></FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:12 }}>
          {EXPERIENCE.map((job: ExperienceEntry, i: number) => (
            <FadeIn key={job.company} delay={i * 0.1}>
              <div className="job-card-compact">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <span className="mono" style={{ fontSize:12, color:T.accent, letterSpacing:"0.07em", fontWeight:500 }}>
                    {job.company}
                  </span>
                  <span className="mono" style={{ fontSize:10, color:T.muted, letterSpacing:"0.06em", textAlign:"right", lineHeight:1.4 }}>
                    {job.period.split("–").map((p: string, pi: number) => (
                      <span key={pi} style={{ display:"block" }}>{p.trim()}</span>
                    ))}
                  </span>
                </div>
                <h3 style={{ fontSize:17, fontWeight:400, letterSpacing:"-0.01em", color:T.fg, marginBottom:6, lineHeight:1.2 }}>
                  {job.title}
                </h3>
                <p className="mono" style={{ fontSize:11, color:T.muted, letterSpacing:"0.06em", marginBottom:12 }}>
                  {job.type}
                </p>
                <p className="mono" style={{ fontSize:12, lineHeight:1.75, color:T.bodyMuted, marginBottom:16 }}>
                  {job.summary}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {job.tags.map((tag: string) => <span key={tag} className="xtag">{tag}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section style={{ padding:"80px clamp(24px,6vw,80px)", maxWidth:1000, margin:"0 auto" }}>
        <FadeIn><p className="slabel">Technical Skills</p></FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:44 }}>
          {SKILLS.map((g: SkillGroup, gi: number) => (
            <FadeIn key={g.category} delay={gi * 0.1}>
              <h3 className="mono" style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", marginBottom:16, color:T.accent, textTransform:"uppercase" }}>
                {g.category}
              </h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {g.items.map((item: string) => <span key={item} className="chip">{item}</span>)}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding:"80px clamp(24px,6vw,80px) 180px", maxWidth:1000, margin:"0 auto" }}>
        <FadeIn><p className="slabel">Get in Touch</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:400, letterSpacing:"-0.02em", marginBottom:16, lineHeight:1.1, color:T.fg }}>
            Let's build something<br /><em style={{ color:T.accent }}>together.</em>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mono" style={{ fontSize:13, color:T.muted, lineHeight:1.8, maxWidth:400, marginBottom:52 }}>
            Open to new opportunities, interesting problems, and meaningful collaborations.
          </p>
        </FadeIn>
        {sent ? (
          <FadeIn>
            <div className="mono" style={{ fontSize:13, color:T.accent, padding:"28px 32px", border:`1px solid ${T.accent}40`, maxWidth:400, background:T.accentSoft }}>
              ✓ Message received. I'll be in touch soon.
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.3}>
            <form onSubmit={handleSubmit} style={{ maxWidth:460, display:"flex", flexDirection:"column", gap:30 }}>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, email: e.target.value }))}
                required
              />
              <textarea
                placeholder="Tell me about your project..."
                rows={4}
                value={form.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm((s) => ({ ...s, message: e.target.value }))}
                style={{ resize:"none" }}
                required
              />
              <button type="submit" className="btn-p" style={{ alignSelf:"flex-start" }}>Send Message</button>
            </form>
          </FadeIn>
        )}
        <FadeIn delay={0.4}>
          <div style={{ marginTop:72, display:"flex", gap:28, flexWrap:"wrap" }}>
            {[
              { label: "GitHub",   href: "https://github.com/Preetham-Mukkara" },
              { label: "LinkedIn", href: "https://linkedin.com/in/preethammu" },
              { label: "Email",    href: "mailto:mukkarapreetham@gmail.com" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="larrow" target="_blank" rel="noopener noreferrer">
                {l.label} <span>↗</span>
              </a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${T.subtle}`, padding:"22px clamp(24px,6vw,80px)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <span className="mono" style={{ fontSize:11, color:T.muted, letterSpacing:"0.08em" }}>
          © {new Date().getFullYear()} Preetham Mukkara
        </span>
        <span className="mono" style={{ fontSize:11, color:T.muted, letterSpacing:"0.06em" }}>
          ☁ Seattle, WA
        </span>
      </footer>
    </div>
  );
}