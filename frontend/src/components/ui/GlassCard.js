import React from 'react';
import '../../styles/designTokens.css';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass card ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
