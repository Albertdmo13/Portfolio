import TextType from "./TextType";
import SpecularButton from "./SpecularButton";
import CopyEmailButton from "./CopyEmailButton";
import "./BusinessCardHero.css";

export default function BusinessCardHero({ t, lang, onContactClick, Icons }) {
  const { Mail, Github, Linkedin } = Icons;

  return (
    <section className="hero-section">
      <div className="business-card">
        {/* Top Row: Monogram Chip + Live Status Badge */}
        <div className="card-top-row">
            <div className="card-chip">
              <div className="card-chip-emblem">
                <span className="card-chip-initials">AD</span>
                <span className="card-chip-line" />
              </div>
              <div className="card-chip-meta">
                <span className="card-chip-id">ALBERTO DÍAZ</span>
                <span className="card-chip-sub">ID // ES • VISILAB</span>
              </div>
            </div>

            <div className="status-badge">
              <span className="status-dot" />
              {t.personalInfo.status}
            </div>
          </div>

          {/* Middle Body: Name, Role Headline, Bio */}
          <div className="card-body">
            <h1 className="hero-title">{t.personalInfo.name}</h1>

            <div className="hero-role">
              <span className="role-prefix">❯</span>
              <TextType
                key={lang}
                text={t.roles}
                typingSpeed={48}
                deletingSpeed={24}
                pauseDuration={2400}
                showCursor={true}
                cursorCharacter="|"
              />
            </div>

            <p className="hero-bio">{t.personalInfo.bio}</p>
          </div>

          {/* Bottom Row / Contact Strip */}
          <div className="card-footer-row">
            <div className="card-actions-left">
              <SpecularButton
                size="md"
                radius={10}
                tint="rgba(255, 255, 255, 0.08)"
                blur={14}
                lineColor="#ffffff"
                baseColor="#3e3e4a"
                intensity={1.5}
                shineSize={14}
                shineFade={35}
                autoAnimate={true}
                onClick={onContactClick}
              >
                <Mail />
                {t.hero.getInTouch}
              </SpecularButton>

              <CopyEmailButton 
                email={t.personalInfo.email} 
                copiedText={t.contact?.copiedBtn || "Copied!"} 
                Icons={Icons} 
              />
            </div>

            <div className="card-actions-right">
              <a
                href={t.personalInfo.links.github}
                target="_blank"
                rel="noreferrer"
                className="btn-icon card-social-btn"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                href={t.personalInfo.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-icon card-social-btn"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Subdued Card Corner Watermark */}
          <div className="card-corner-watermark">
            <span>PORTFOLIO 2026</span>
          </div>
        </div>
    </section>
  );
}
