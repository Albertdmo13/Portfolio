import { useState, useMemo } from "react";
import "./SkillsWindow.css";

// Componente de barra de progreso (sin cambios)
const ProgressBar = ({ level, maxLevel = 100, pixelSize }) => {
  const progressPercent = Math.min(level, maxLevel) / maxLevel;
  const progressBarHeight = 2.5 * pixelSize;

  return (
    <div
      className="progress-bar-container"
      style={{
        height: `${progressBarHeight}px`,
        marginTop: `${0.8 * pixelSize}px`,
        marginBottom: `${0.4 * pixelSize}px`,
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          width: `${progressPercent * 100}%`,
          transition: "width 0.4s ease-out",
        }}
      />
    </div>
  );
};

export default function SkillsWindow({ pixelSize = 4 }) {
  const [selected, setSelected] = useState(null);

  const BASE_WIDTH = 160;
  const BASE_HEIGHT = 95;

  const WINDOW_WIDTH = BASE_WIDTH * pixelSize;
  const WINDOW_HEIGHT = BASE_HEIGHT * pixelSize;
  const LIST_WIDTH = 61 * pixelSize;
  const HANDLE_HEIGHT = 0 * pixelSize;

  // --- NUEVA ESTRUCTURA DE DATOS AGRUPADA ---
  const groupedItems = useMemo(
    () => [
      {
        title: "Development",
        skills: [
          {
            id: 4,
            name: "ReactJS",
            description:
              "Component-based architecture and state management for dynamic UIs.",
            level: 75,
          },
          {
            id: 5,
            name: "Node.js",
            description:
              "Server-side development, REST APIs, and asynchronous operations.",
            level: 40,
          },
        ],
      },
      {
        title: "Game Development",
        skills: [
          {
            id: 3,
            name: "GameMaker",
            description:
              "Retro 2D game engine wizardry for fast prototyping and deployment.",
            level: 92,
          },
          {
            id: 2,
            name: "OpenGL",
            description:
              "Mastery of rendering pipelines, VBOs, and matrix transformations.",
            level: 60,
          },
        ],
      },
      {
        title: "Art",
        skills: [
          {
            id: 1,
            name: "Pixel Shader",
            description:
              "Low-level GPU artistry for stunning visual effects and retro flair.",
            level: 85,
          },
        ],
      },
      {
        title: "Others",
        skills: [],
      },
    ],
    []
  );

  // Función para manejar la selección con animación de transición
  const handleSelect = (item) => {
    setSelected(null);
    setTimeout(() => setSelected(item), 10);
  };

  return (
    <div
      className="skills-window"
      style={{
        width: `${WINDOW_WIDTH}px`,
        height: `${WINDOW_HEIGHT}px`,
      }}
    >
      {/* === LEFT SECTION: SKILLS LIST === */}
      <div
        className="skills-list"
        style={{
          width: `${LIST_WIDTH}px`,
          padding: `${2 * pixelSize}px`,
          paddingTop: `${HANDLE_HEIGHT}px`,
        }}
      >
        {/* Renderizado agrupado */}
        {groupedItems.map((group) => (
          <div key={group.title} className="skills-group">
            {/* Título de la sección */}
            <div className="skills-section-title">{group.title}</div>

            {/* Lista de habilidades en la sección */}
            {group.skills.length > 0 ? (
              group.skills.map((item) => (
                <div
                  key={item.id}
                  className={`skills-list-item ${
                    selected?.id === item.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(item)}
                  style={{
                    marginBottom: `${2 * pixelSize}px`,
                    padding: `${1.5 * pixelSize}px ${2 * pixelSize}px`,
                  }}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div
                className="skills-list-item-empty"
                style={{
                  padding: `${1.5 * pixelSize}px ${2 * pixelSize}px`,
                }}
              >
                [EMPTY]
              </div>
            )}
          </div>
        ))}
      </div>

      {/* === RIGHT SECTION: SKILLS INFO === */}
      <div
        className="skills-info"
        style={{
          flex: 1,
          padding: `${3 * pixelSize}px`,
          paddingTop: `${HANDLE_HEIGHT + 2 * pixelSize}px`,
        }}
      >
        {selected ? (
          <div className="skills-info-container">
            {/* Box 1: Name and Level */}
            <div className="skills-info-box">
              <span style={{ fontWeight: "bold" }}>{selected.name}</span>
              <span style={{ float: "right" }}>Level {selected.level}</span>
              <ProgressBar level={selected.level} pixelSize={pixelSize} />
            </div>

            {/* Box 2: Description */}
            <div className="skills-info-box description-box">
              {selected.description}
            </div>
          </div>
        ) : (
          <div className="skills-placeholder animated-placeholder">
            <br />
            Select a skill to view its detailed information and progress.
          </div>
        )}
      </div>
    </div>
  );
}
