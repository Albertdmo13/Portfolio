import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "./data";
import LatticeLoader from "./LatticeLoader";
import TextType from "./TextType";
import SpecularButton from "./SpecularButton";
import RubberSegment from "./RubberSegment";
import BusinessCardHero from "./BusinessCardHero";
import ImageCarousel from "./ImageCarousel";
import "./App.css";

// Minimal SVG icons
const Icons = {
  Github: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Cv: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Copy: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  Check: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const JAVA_ICON_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Cpath fill='%23ffffff' d='M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z'/%3E%3C/svg%3E";

const getTechIconUrl = (techName) => {
  if (techName === "Java") {
    return JAVA_ICON_DATA_URL;
  }
  const map = {
    "React": "react",
    "JavaScript": "javascript",
    "Python": "python",
    "Flask": "flask",
    "MySQL": "mysql",
    "Docker": "docker",
    "Qt": "qt",
    "Raspberry Pi 5": "raspberrypi",
    "C / C++": "cplusplus",
    "SQL": "postgresql",
    "HTML / CSS": "html5",
    "Angular": "angular",
    "Node.js": "nodedotjs",
    "OpenGL": "opengl",
    "Three.js basics": "threedotjs",
    "Three.js básico": "threedotjs",
    "Git": "git",
    "GitHub": "github",
    "Linux": "linux",
    "Blender": "blender",
    "Arduino": "arduino",
    "Aseprite": "aseprite",
    "GameMaker": "gamemaker",
  };
  const iconName = map[techName];
  return iconName ? `https://cdn.simpleicons.org/${iconName}/white` : null;
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loaderStatus, setLoaderStatus] = useState("working");
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoaderStatus("done");
    }, 600);
    const timer2 = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const t = portfolioData[lang] || portfolioData.en;

  const sectionAnimation = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5 }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(t.personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#08080a',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LatticeLoader
              status={loaderStatus}
              color="#488ee9ff"
              doneColor="#10a37f"
              label="Loading Portfolio"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="background-layer">
        <div className="foreground-layer">
          {/* Navigation Bar */}
          <header className="nav-header">
            <div className="nav-content">
              <a href="#" className="nav-brand">
                {t.personalInfo.shortName}
              </a>
              <nav className="nav-links">
                <a href="#experience" className="nav-link">{t.nav.experience}</a>
                <a href="#projects" className="nav-link">{t.nav.projects}</a>
                <a href="#publications" className="nav-link">{t.nav.publications}</a>
                <a href="#skills" className="nav-link">{t.nav.skills}</a>
                <a href="#contact" className="nav-link">{t.nav.contact}</a>
                <RubberSegment
                  items={[
                    { value: "en", label: "EN" },
                    { value: "es", label: "ES" },
                  ]}
                  value={lang}
                  onChange={(val) => setLang(val)}
                  size="sm"
                  radius={9999}
                  inset={2}
                  trackColor="rgba(255, 255, 255, 0.06)"
                  thumbColor="#ffffff"
                  textColor="rgba(255, 255, 255, 0.65)"
                  activeTextColor="#0a0a0f"
                  aria-label="Language selector"
                />
                <SpecularButton
                  size="sm"
                  radius={8}
                  tint="rgba(255, 255, 255, 0.05)"
                  blur={10}
                  lineColor="#60a5fa"
                  baseColor="#3a3a44"
                  intensity={1.3}
                  autoAnimate={true}
                  onClick={() => {
                    window.open(`${base}${t.personalInfo.links.cv.replace(/^\/?(Portfolio\/)?/, "")}`, "_blank");
                  }}
                >
                  <Icons.Cv />
                  {t.nav.cv}
                </SpecularButton>
              </nav>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="main-content animate-in">
            {/* Business Card Hero Section */}
            <BusinessCardHero
              t={t}
              lang={lang}
              Icons={Icons}
              onContactClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Trajectory / Experience Section */}
            <motion.section id="experience" className="section" {...sectionAnimation}>
              <h2 className="section-label">{t.sections.trajectory}</h2>
              <div className="timeline-container">
                <div className="timeline-track" />
                <div className="timeline-items">
                  {t.trajectory.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="timeline-item"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                    >
                      <div className="timeline-marker">
                        <span className="timeline-dot" />
                        <span className="timeline-connector" />
                      </div>
                      <div className="timeline-card">
                        <div className="timeline-inner">
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h3 className="timeline-role">{item.role}</h3>
                              <span className="timeline-period">{item.period}</span>
                            </div>
                            {item.institution && (
                              <p className="timeline-institution">
                                {item.link ? (
                                  <a href={item.link} target="_blank" rel="noreferrer" className="timeline-link">
                                    {item.institution}
                                  </a>
                                ) : (
                                  item.institution
                                )}
                              </p>
                            )}
                            {item.description && <p className="timeline-desc">{item.description}</p>}
                          </div>
                          {item.logo && (
                            item.link ? (
                              <a href={item.link} target="_blank" rel="noreferrer" className="timeline-logo-link" style={{ display: 'flex' }}>
                                <img
                                  src={`${base}${item.logo.replace(/^\/?(Portfolio\/)?/, "")}`}
                                  alt={`${item.institution} logo`}
                                  className="timeline-logo"
                                />
                              </a>
                            ) : (
                              <img
                                src={`${base}${item.logo.replace(/^\/?(Portfolio\/)?/, "")}`}
                                alt={`${item.institution} logo`}
                                className="timeline-logo"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Projects Section */}
            <motion.section id="projects" className="section" {...sectionAnimation}>
              <h2 className="section-label">{t.sections.projects}</h2>
              <div className="projects-grid">
                {t.projects.map((proj) => (
                  <article key={proj.id} className="project-card">
                    {proj.video && (
                      <div className="project-media">
                        <video
                          src={`${base}${proj.video.replace(/^\/?(Portfolio\/)?/, "")}`}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="project-video"
                        />
                      </div>
                    )}
                    <div className="project-body">
                      <div className="project-top">
                        <div>
                          <h3 className="project-title">{proj.title}</h3>
                          <p className="project-subtitle">{proj.subtitle}</p>
                        </div>
                      </div>
                      <p className="project-desc">{proj.description}</p>
                      <div className="project-tags">
                        {proj.tags.map((tag, i) => {
                          const iconUrl = getTechIconUrl(tag);
                          return (
                            <span key={i} className="project-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              {iconUrl && (
                                <img
                                  src={iconUrl}
                                  alt={tag}
                                  style={{ width: '16px', height: '16px' }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                      <div className="project-links">
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="project-link-btn">
                            <Icons.External /> Live App
                          </a>
                        )}
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noreferrer" className="project-link-btn">
                            <Icons.Github /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>

            {/* Publications Section */}
            <motion.section id="publications" className="section" {...sectionAnimation}>
              <h2 className="section-label">{t.sections.publications || "Publications"}</h2>
              <div className="publications-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {t.publications && t.publications.map((pub, idx) => (
                  <article key={idx} className="project-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flexGrow: 1 }}>
                        <h3 className="project-title" style={{ margin: 0, color: 'var(--text-main)' }}>{pub.title}</h3>
                        {pub.authors && (
                          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.55)', fontStyle: 'italic' }}>
                            {pub.authors}
                          </p>
                        )}
                      </div>
                      {pub.logo && (
                        <img
                          src={`${base}${pub.logo.replace(/^\/?(Portfolio\/)?/, "")}`}
                          alt="Publication logo"
                          style={{ width: '64px', height: 'auto', flexShrink: 0, filter: 'invert(1)', opacity: 0.8 }}
                        />
                      )}
                    </div>
                    <p className="project-desc" style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                      <strong>Abstract:</strong> {pub.abstract}
                    </p>
                    {pub.images && pub.images.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <ImageCarousel images={pub.images} base={base} />
                      </div>
                    )}
                    <div>
                      <a href={pub.link} target="_blank" rel="noreferrer" className="project-link-btn" style={{ display: 'inline-flex', width: 'max-content' }}>
                        <Icons.External /> View Paper
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
            {/* Skills Section */}
            <motion.section id="skills" className="section" {...sectionAnimation}>
              <h2 className="section-label">{t.sections.skills}</h2>
              <div className="skills-grid">
                {t.skillCategories.map((cat, idx) => (
                  <div key={idx} className="skill-category-card">
                    <h3 className="skill-category-name">{cat.name}</h3>
                    <div className="skill-pill-container">
                      {cat.skills.map((skill, i) => {
                        const iconUrl = getTechIconUrl(skill);
                        return (
                          <span key={i} className="skill-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            {iconUrl && (
                              <img
                                src={iconUrl}
                                alt={skill}
                                style={{ width: '20px', height: '20px' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section id="contact" className="section" {...sectionAnimation}>
              <h2 className="section-label">{t.sections.contact}</h2>
              <div className="contact-card">
                <h3 className="contact-card-title">{t.contact.title}</h3>
                <p className="contact-card-desc">{t.contact.desc}</p>
                <div className="contact-actions">
                  <button onClick={handleCopyEmail} className="email-copy-btn">
                    {copied ? <Icons.Check /> : <Icons.Copy />}
                    {copied ? t.contact.copiedBtn : t.personalInfo.email}
                  </button>
                  <SpecularButton
                    size="md"
                    radius={10}
                    tint="rgba(255, 255, 255, 0.06)"
                    blur={14}
                    lineColor="#60a5fa"
                    baseColor="#40404c"
                    intensity={1.5}
                    autoAnimate={true}
                    onClick={() => {
                      window.location.href = t.personalInfo.links.email;
                    }}
                  >
                    <Icons.Mail />
                    {t.contact.clientBtn}
                  </SpecularButton>
                </div>
              </div>
            </motion.section>
          </main>

          {/* Footer */}
          <footer className="footer">
            <p className="footer-text">
              © {new Date().getFullYear()} {t.personalInfo.name}. {t.footer.text}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
