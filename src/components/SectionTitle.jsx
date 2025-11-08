import React from 'react';
import PropTypes from 'prop-types';
// Asegúrate de que el nombre del CSS coincida.
// Lo he renombrado a .css en lugar de .module.css
// según tu import original.
import './SectionTitle.css';

/**
 * Componente reutilizable para títulos de sección.
 *
 * Props:
 * - text: string → texto del título
 * - as: string|elementType → etiqueta HTML a usar (h1, h2, span, etc.)
 * - pixelSize: number → tamaño base para escalar
 * - color: string → color del texto
 * - shadowColor: string → color de la sombra
 * - className: string → clases CSS adicionales
 */
export default function SectionTitle({
  text,
  as: Tag = 'h2', // Permite cambiar la tag (h1, h3, etc.)
  pixelSize = 4,
  color = '#fff',
  shadowColor = '#000',
  className = '', // Permite pasar clases externas
  ...props // Pasa cualquier otra prop (como id, aria-label)
}) {

  // Define las variables CSS que se inyectarán en el estilo
  const styleVariables = {
    '--pixel-size': `${pixelSize}px`,
    '--text-color': color,
    '--shadow-color': shadowColor,
  };

  return (
    <Tag
      // La clase principal es ahora el 'contenedor' flex
      className={`title-wrapper ${className}`}
      style={styleVariables}
      {...props}
    >
      {/* 1. LÍNEA IZQUIERDA */}
      {/* aria-hidden=true porque los guiones son decorativos
          y no deben ser leídos por lectores de pantalla */}
      <span
        className="title-line title-line-left"
        aria-hidden="true"
      />

      {/* 2. TEXTO CENTRAL */}
      {/* Aplicamos los estilos de píxeles al texto, no al contenedor */}
      <span className="title-text">
        {`<< ${text} >>`}
      </span>

      {/* 3. LÍNEA DERECHA */}
      <span
        className="title-line title-line-right"
        aria-hidden="true"
      />
    </Tag>
  );
}

// Validación de props (sin cambios)
SectionTitle.propTypes = {
  text: PropTypes.string.isRequired,
  as: PropTypes.elementType,
  pixelSize: PropTypes.number,
  color: PropTypes.string,
  shadowColor: PropTypes.string,
  className: PropTypes.string,
};
