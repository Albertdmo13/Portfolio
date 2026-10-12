import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import "./PublicationCard.css";

export default function PublicationCard({
  pub,
  idx = 0,
  lang = "en",
  assetUrl,
  base,
  Icons,
}) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.05 });

  const isPdf = Boolean(pub.file || pub.link?.toLowerCase().endsWith(".pdf"));

  const handleOpen = () => {
    const target = pub.file || pub.link;
    if (!target) return;
    const url = target.startsWith("http") ? target : (assetUrl ? assetUrl(target) : target);
    if (url) {
      window.open(encodeURI(url), "_blank", "noopener,noreferrer");
    }
  };

  const isBlackLogo = pub.logo?.toLowerCase().includes("black");

  return (
    <motion.article
      ref={cardRef}
      className="project-card publication-card"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: idx * 0.15, ease: "easeOut" }}
      onClick={handleOpen}
      onAuxClick={(e) => {
        if (e.button === 1) handleOpen();
      }}
      tabIndex={0}
      role="link"
      aria-label={`${pub.title} - ${
        isPdf
          ? lang === "es"
            ? "Ver PDF"
            : "View PDF"
          : lang === "es"
          ? "Ver Publicación"
          : "View Paper"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className="pub-header">
        <div className="pub-meta">
          <h3 className="project-title">{pub.title}</h3>
          {pub.authors && <p className="pub-authors">{pub.authors}</p>}
        </div>

        {pub.logo ? (
          <div className="pub-logo-container">
            <img
              src={assetUrl ? assetUrl(pub.logo) : pub.logo}
              alt={`${pub.title} logo`}
              width={64}
              height={42}
              loading="lazy"
              decoding="async"
              className={`pub-logo-img ${isBlackLogo ? "pub-logo-img--invert" : ""}`}
            />
          </div>
        ) : isPdf ? (
          <div className="pub-pdf-badge">
            {Icons?.Cv && <Icons.Cv />}
            <span>PDF</span>
          </div>
        ) : null}
      </div>

      <p className="project-desc pub-desc">
        <strong>{lang === "es" ? "Resumen:" : "Abstract:"}</strong> {pub.abstract}
      </p>

      {pub.images && pub.images.length > 0 && (
        <div
          className="pub-carousel-container"
          onClick={(e) => e.stopPropagation()}
          onAuxClick={(e) => e.stopPropagation()}
        >
          <ImageCarousel images={pub.images} base={base} />
        </div>
      )}
    </motion.article>
  );
}
