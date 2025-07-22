import React from 'react';

const PortfolioButton = ({ label, selected = false, onClick }: { label: string; selected?: boolean; onClick?: () => void }) => (
  <div
    onClick={onClick}
    style={{
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
      background: `linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, ${selected ? '0.10' : '0.05'})`,
      boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.60)',
      borderRadius: 80,
      outline: '1px rgba(255, 255, 255, 0.10) solid',
      outlineOffset: '-1px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      display: 'inline-flex',
      cursor: onClick ? 'pointer' : 'default',
      userSelect: 'none',
    }}
  >
    <div
      style={{
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        overflow: 'hidden',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        display: 'flex',
      }}
    >
      <div
        style={{
          color: '#D7D8DE',
          fontSize: 14,
          fontFamily: 'Inter',
          fontWeight: 600,
          lineHeight: '20px',
          wordWrap: 'break-word',
        }}
      >
        {label}
      </div>
    </div>
  </div>
);

export default PortfolioButton; 