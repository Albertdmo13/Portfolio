import { useState, useRef, useLayoutEffect, useEffect } from "react";
import FloatingLines from "./FloatingLines";
import ImageCarousel from "./ImageCarousel";
import "./ProjectDetailSection.css";

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

  // Grid Snapping: Snap total section height strictly to integer multiples of 32px
  // ensuring zero coordinate disruption to any subsequent portfolio sections.
  const contentRef = useRef(null);
  const [padding, setPadding] = useState({ top: 48, bottom: 48, targetHeight: 0 });

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.offsetHeight;
      if (!h) return;
      const minPadding = 80; // Minimum 80px total vertical breathing space (~40px top, ~40px bottom)
      const targetHeight = Math.ceil((h + minPadding) / 32) * 32;
      const extra = targetHeight - h;
      const top = Math.floor(extra / 2);
      const bottom = extra - top;
      setPadding({ top, bottom, targetHeight });
    };

    measure();
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 400);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Video playback state
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current && project?.video) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [project?.video]);

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

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Unique background dispatcher per project (full 100vw, rendered only when visible)
  const renderProjectBackground = () => {
    switch (projectId) {
      case "flowdip":
        return (
          <FloatingLines
            enabledWaves={["middle", "top", "bottom"]}
            lineCount={2}
            lineDistance={93}
            bendRadius={1}
            bendStrength={-0.5}
            interactive={false}
            parallax={true}
            animationSpeed={0.8}
            lineIntensity={0.9}
            bloomSize={0}
            gradientStart="#2CC091"
            gradientMid="#158055"
            gradientEnd="#22d3ee"
            linesGradient={["#2CC091", "#158055", "#22d3ee"]}
            mixBlendMode="normal"
            backgroundColor="#08080a"
          />
        );
      default:
        return null;
    }
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
    <section
      id={projectId}
      data-accent-color={accent}
      data-section-name={project?.title || "FlowDiP"}
      className="project-detail-section"
      style={{
        "--project-accent": accent,
        height: padding.targetHeight ? `${padding.targetHeight}px` : undefined,
        minHeight: padding.targetHeight ? `${padding.targetHeight}px` : undefined,
        boxSizing: "border-box",
      }}
      aria-label={`${project?.title || "Project"} details`}
    >
      {/* Top Section Divider Line matching portfolio 32px background grid */}
      <div className="section-divider-line" style={{ top: 0 }} />

      {/* Sticky section label on the left margin matching all other sections */}
      <div className="section-label-track">
        <h2
          className={`section-label ${projectId?.toLowerCase() === "flowdip" ? "section-label--logo" : ""}`}
        >
          {projectId?.toLowerCase() === "flowdip" ? (
            <>
              <img
                src={`${base}media/FlowDiP_wide.svg`}
                alt="FlowDiP"
                width="284"
                height="96"
                className="section-label-logo-img"
              />
              <span className="sr-only">FlowDiP</span>
            </>
          ) : (
            project?.title || "FLOWDIP"
          )}
        </h2>
      </div>

      {/* Page-wide background replacing background grid lines exclusively on this section */}
      <div className="pds-page-background" aria-hidden="true">
        {renderProjectBackground()}
      </div>

      {/* Main Content Card matching portfolio style with grid-snapped padding */}
      <div
        className="pds-frame"
        style={{
          paddingTop: `${padding.top}px`,
          paddingBottom: `${padding.bottom}px`,
        }}
      >
        <div ref={contentRef} className="pds-content-inner">
          <div className="pds-card">
            {/* Top Control Bar (Integrated Card Header) */}
            <div className="pds-top-bar">
              <div className="pds-top-bar-left">
                <span
                  className="pds-accent-pip"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <h3 className="pds-top-title">{project?.title || "Project Detail"}</h3>
                <span className="pds-top-subtitle">{project?.subtitle || ""}</span>
              </div>

              <div className="pds-top-bar-controls">
                {onClose && (
                  <button
                    type="button"
                    className="pds-control-btn pds-control-btn--close"
                    onClick={onClose}
                    title={tUI.close}
                    aria-label={tUI.close}
                  >
                    {Icons?.Close && <Icons.Close />}
                    <span>{tUI.close}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Wide Video Player on top */}
            <div className="pds-video-wrapper">
              {project?.video ? (
                <div ref={videoContainerRef} className="pds-video-player-container">
                  <video
                    ref={videoRef}
                    src={`${base}${project.video.replace(/^\/?(Portfolio\/)?/, "")}`}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    className="pds-video-element"
                    onClick={toggleVideoPlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Center Play Overlay when paused */}
                  {!isPlaying && (
                    <button
                      type="button"
                      className="pds-video-center-play"
                      onClick={toggleVideoPlay}
                      aria-label="Play video"
                    >
                      <span className="pds-video-play-triangle" />
                    </button>
                  )}

                  {/* Custom Bottom Control Bar */}
                  <div className="pds-video-controls-bar">
                    {/* Scrubbable Progress Bar */}
                    <div
                      className="pds-video-progress-track"
                      onClick={handleSeek}
                      title="Seek"
                    >
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

                    <div className="pds-video-controls-row">
                      <div className="pds-video-controls-left">
                        <button
                          type="button"
                          className="pds-video-btn"
                          onClick={toggleVideoPlay}
                          aria-label={isPlaying ? "Pause" : "Play"}
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
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
                          onClick={toggleVideoMute}
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          className="pds-video-btn"
                          onClick={toggleFullscreen}
                          aria-label="Toggle Fullscreen"
                          title="Fullscreen"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </section>
  );
}
