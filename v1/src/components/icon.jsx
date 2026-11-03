// components/common/icon.jsx
import React from 'react';
import icons from '../assets/icons/icons.json';

const Icon = ({ 
  name, 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2,
  className = "",
  style = {},
  ...props 
}) => {
  const icon = icons[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found in icons data`);
    return null;
  }

  // base SVG props
  const svgProps = {
    width: size,
    height: size,
    viewBox: icon.viewBox,
    className: `icon icon-${name} ${className}`,
    style,
    ...props
  };

  // stroke-based icons
  if (icon.stroke && icon.paths) {
    return (
      <svg 
        {...svgProps} 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon.paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </svg>
    );
  }

  // handle single path fill icons
  return (
    <svg {...svgProps} fill={color}>
      <path d={icon.path} />
    </svg>
  );
};

export default Icon;