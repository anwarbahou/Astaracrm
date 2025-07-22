import React from 'react';

const ProjectDisplay = ({ name }: { name: string }) => (
  <div
    style={{
      alignSelf: 'stretch',
      height: 720,
      padding: 8,
      position: 'relative',
      background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.02) 100%)',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.60)',
      overflow: 'hidden',
      borderRadius: 40,
      outline: '1px rgba(255, 255, 255, 0.20) solid',
      outlineOffset: '-1px',
      backdropFilter: 'blur(12px)',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: 8,
      display: 'inline-flex',
    }}
  >
    <div style={{ color: 'white', fontSize: 80, fontFamily: 'Inter', fontWeight: 900, lineHeight: '104px', wordWrap: 'break-word', width: '100%', textAlign: 'center', margin: 'auto' }}>
      {name}
    </div>
  </div>
);

export default ProjectDisplay; 