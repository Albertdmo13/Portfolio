import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingLines from "./FloatingLines";
import ImageCarousel from "./ImageCarousel";
import "./ProjectDetailSection.css";

const FLOWDIP_WAVES = ["middle", "top", "bottom"];
const FLOWDIP_GRADIENT = ["#2CC091", "#158055", "#22d3ee"];

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

function ProjectVideoPlayer({ videoSrc, accent }) {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoSrc) return;
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
        });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [videoSrc]);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const toggleFullscreen = () => {
    const el = videoContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={videoContainerRef} className="pds-video-player-container">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        className="pds-video-element"
        onClick={toggleVideoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Center play button overlay when paused */}
      {!isPlaying && (
        <button
          type="button"
          className="pds-video-center-play"
          onClick={toggleVideoPlay}
          aria-label="Play video"
        >
          <div className="pds-video-play-triangle" />
        </button>
      )}

      {/* Video Controls Bar */}
      <div className="pds-video-controls-bar">
        {/* Seek track */}
        <div className="pds-video-progress-track" onClick={handleSeek}>
          <div
            className="pds-video-progress-fill"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              backgroundColor: accent,
            }}
          />
          <div
            className="pds-video-progress-thumb"
            style={{
              left: `${duration ? (currentTime / duration) * 100 : 0}%`,
              backgroundColor: accent,
            }}
          />
        </div>

        {/* Buttons row */}
        <div className="pds-video-controls-row">
          <div className="pds-video-controls-left">
            <button
              type="button"
              className="pds-video-btn"
              onClick={toggleVideoPlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="pds-video-btn"
              onClick={toggleVideoMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            <span className="pds-video-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="pds-video-controls-right">
            <button
              type="button"
              className="pds-video-btn"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailSection({
  projectId = "flowdip",
  project,
  onClose,
  lang = "en",
  Icons,
  getTechIconUrl,
}) {
  const base = import.meta.env.BASE_URL;
  const accent = project?.accentColor || "#2CC091";

  // Deferred background state: allows instant 60fps opening without blocking on WebGL context/shader compilation
  const [isBgActive, setIsBgActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBgActive(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Unique background dispatcher per project
  const renderProjectBackground = () => {
    if (!isBgActive || projectId?.toLowerCase() !== "flowdip") return null;
    return (
      <div className="pds-floating-lines-fadein">
        <FloatingLines
          enabledWaves={FLOWDIP_WAVES}
          lineCount={2}
          lineDistance={93}
          bendRadius={1}
          bendStrength={-0.5}
          interactive={false}
          parallax={true}
          animationSpeed={0.8}
          lineIntensity={0.9}
          bloomSize={0}
          linesGradient={FLOWDIP_GRADIENT}
          mixBlendMode="normal"
          backgroundColor="transparent"
        />
      </div>
    );
  };

  const tUI = {
    close: lang === "es" ? "Cerrar" : "Close",
    mediaPlaceholder: lang === "es" ? "[ Espacio de vídeo ]" : "[ Video showcase ]",
    mediaFormat: "16:9 • MP4 / WebM",
    descPlaceholder: lang === "es" ? "Sin descripción disponible." : "No description available.",
    liveApp: lang === "es" ? "Aplicación en vivo" : "Live App",
    source: lang === "es" ? "Código fuente" : "Source Code",
  };

  return (
    <motion.div
      className="pds-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project?.title || "Project"} details`}
    >
      {/* Ambient background lines */}
      <div className="pds-overlay-ambient-bg" aria-hidden="true">
        {renderProjectBackground()}
      </div>

      <motion.div
        className="pds-overlay-dialog"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ "--project-accent": accent }}
      >
        {/* Top Control Bar (Integrated Card Header) */}
        <div className="pds-top-bar">
          <div className="pds-top-bar-left">
            <span
              className="pds-accent-pip"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            {projectId?.toLowerCase() === "flowdip" ? (
              <img
                src={`${base}media/FlowDiP_wide.svg`}
                alt="FlowDiP"
                height="28"
                className="pds-header-logo-img"
              />
            ) : (
              <h3 className="pds-top-title">{project?.title || "Project Detail"}</h3>
            )}
            {project?.subtitle && (
              <span className="pds-top-subtitle">{project.subtitle}</span>
            )}
          </div>

          <div className="pds-top-bar-controls">
            {(project?.link || project?.liveAppUrl) && (
              <a
                href={project.liveAppUrl || project.link}
                target="_blank"
                rel="noreferrer"
                className="pds-header-action-btn"
                title={tUI.liveApp}
              >
                {Icons?.External && <Icons.External />}
                <span>{tUI.liveApp}</span>
              </a>
            )}
            {onClose && (
              <button
                type="button"
                className="pds-control-btn pds-control-btn--close"
                onClick={onClose}
                title={tUI.close}
                aria-label={tUI.close}
              >
                {Icons?.Close ? (
                  <Icons.Close />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
                <span>{tUI.close}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="pds-modal-scroll-body">
          {/* 1. Wide Video Player on top */}
          <div className="pds-video-wrapper">
            {project?.video ? (
              <ProjectVideoPlayer
                videoSrc={`${base}${project.video.replace(/^\/?(Portfolio\/)?/, "")}`}
                accent={accent}
              />
            ) : (
              <div className="pds-video-placeholder">
                <span className="pds-slot-hint">{tUI.mediaPlaceholder}</span>
                <span className="pds-slot-subhint">{tUI.mediaFormat}</span>
              </div>
            )}
          </div>

          {/* 2. Carousel right below the video player */}
          {project?.images && project.images.length > 0 && (
            <div className="pds-carousel-wrapper">
              <ImageCarousel
                images={project.images}
                base={base}
                accentColor={accent}
                altPrefix={`${project?.title || "Project"} preview`}
              />
            </div>
          )}

          {/* 3. Description below the carousel */}
          <div className="pds-description-block">
            <p className="pds-description-text">
              {project?.description || tUI.descPlaceholder}
            </p>
          </div>

          {/* 4. Technologies and Buttons below description */}
          <div className="pds-footer-block">
            {/* Technologies */}
            <div className="pds-tags-row">
              {project?.tags && project.tags.length > 0 ? (
                project.tags.map((tag, i) => {
                  const iconUrl = getTechIconUrl ? getTechIconUrl(tag) : null;
                  return (
                    <span key={i} className="pds-tag-pill">
                      {iconUrl && (
                        <img
                          src={iconUrl}
                          alt={tag}
                          width={16}
                          height={16}
                          style={{ width: "16px", height: "16px", flexShrink: 0 }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      {tag}
                    </span>
                  );
                })
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="pds-actions-row">
              {(project?.link || project?.liveAppUrl) && (
                <a
                  href={project.liveAppUrl || project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="pds-action-btn pds-action-btn--primary"
                >
                  {Icons?.External && <Icons.External />}
                  <span>{tUI.liveApp}</span>
                </a>
              )}
              {project?.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="pds-action-btn"
                >
                  {Icons?.Github && <Icons.Github />}
                  <span>{tUI.source}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
